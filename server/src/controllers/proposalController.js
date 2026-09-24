import { Proposal } from '../models/Proposal.js'
import { Report } from '../models/Report.js'
import { dbReady } from '../db.js'

function requireDB(res) {
    if (!dbReady()) { res.status(503).json({ error: 'database_unavailable' }); return false }
    return true
}

// University / Industry express interest or propose a solution on a challenge
export async function createProposal(req, res) {
    if (!requireDB(res)) return
    try {
        const { type = 'interest', message = '' } = req.body || {}
        const report = await Report.findOne({ id: req.params.id })
        if (!report) return res.status(404).json({ error: 'not_found' })
        if (report.mergedInto) return res.status(400).json({ error: 'merged_report' })
        if (['resolved', 'rejected', 'merged'].includes(report.status)) {
            return res.status(400).json({ error: 'closed_report', message: 'This challenge is already closed' })
        }
        const now = new Date().toISOString()
        const proposal = await Proposal.create({
            reportId: report.id,
            type,
            message: String(message).trim(),
            authorRole: req.user.role,
            authorEmail: req.user.email,
            authorName: req.user.name,
            org: req.user.org || '',
            status: 'proposed',
            createdAt: now,
            updatedAt: now,
        })
        // Surface momentum to government: first interest flips verified/review/forwarded -> matching
        if (['verified', 'review', 'forwarded'].includes(report.status)) {
            report.status = 'matching'
            report.timeline.push({ status: 'matching', at: now, note: `${req.user.name} (${req.user.role}) expressed interest` })
            report.updatedAt = now
            await report.save()
        }
        res.status(201).json(proposal.toJSON())
    } catch (err) {
        res.status(500).json({ error: 'server_error', message: err.message })
    }
}

export async function listProposals(req, res) {
    if (!requireDB(res)) return
    try {
        const { reportId, mine } = req.query
        const filter = {}
        if (reportId) filter.reportId = String(reportId)
        if (mine === 'true') filter.authorEmail = req.user?.email
        const proposals = await Proposal.find(filter).sort({ createdAt: -1 }).lean()
        res.json(proposals.map(({ _id, __v, ...rest }) => ({ id: _id, ...rest })))
    } catch (err) {
        res.status(500).json({ error: 'server_error', message: err.message })
    }
}

// Government accepts/rejects; acceptance wires the partner onto the report
export async function updateProposal(req, res) {
    if (!requireDB(res)) return
    try {
        const { status } = req.body || {}
        if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ error: 'bad_status' })
        const proposal = await Proposal.findById(req.params.id)
        if (!proposal) return res.status(404).json({ error: 'not_found' })
        const now = new Date().toISOString()
        proposal.status = status
        proposal.updatedAt = now
        await proposal.save()

        if (status === 'accepted') {
            const report = await Report.findOne({ id: proposal.reportId })
            if (report) {
                if (proposal.authorRole === 'university') report.assignedUniversity = proposal.authorEmail
                if (proposal.authorRole === 'industry') report.assignedIndustry = proposal.authorEmail
                if (!['solution', 'pilot', 'resolved'].includes(report.status)) {
                    report.status = 'collaboration'
                    report.timeline.push({ status: 'collaboration', at: now, note: `${proposal.org || proposal.authorName} onboarded — collaboration started` })
                } else {
                    report.timeline.push({ status: report.status, at: now, note: `${proposal.org || proposal.authorName} joined as ${proposal.authorRole} partner` })
                }
                report.updatedAt = now
                await report.save()
            }
        }
        res.json(proposal.toJSON())
    } catch (err) {
        res.status(500).json({ error: 'server_error', message: err.message })
    }
}