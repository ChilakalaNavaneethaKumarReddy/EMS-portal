import { Link } from "react-router-dom"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-army-200/70 bg-white dark:border-white/10 dark:bg-[#13160f]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-army-700 text-white">
                <Shield className="h-4 w-4" />
              </span>
              <span className="font-display font-bold text-army-800 dark:text-army-50">Veer Connect</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-army-500 dark:text-army-400">
              A single, trustworthy place for ex-servicemen and their families to find schemes,
              jobs, pension updates and welfare news.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-army-800 dark:text-army-100">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-army-500 dark:text-army-400">
              <li><Link to="/updates" className="hover:text-saffron-600">Latest Updates</Link></li>
              <li><Link to="/jobs" className="hover:text-saffron-600">Jobs</Link></li>
              <li><Link to="/schemes" className="hover:text-saffron-600">Schemes</Link></li>
              <li><Link to="/helplines" className="hover:text-saffron-600">Official Helplines</Link></li>
              <li><Link to="/about" className="hover:text-saffron-600">About Portal</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-army-800 dark:text-army-100">Official Sources</p>
            <ul className="mt-3 space-y-2 text-sm text-army-500 dark:text-army-400">
              <li><a href="https://dgrindia.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saffron-600">DGR Resettlement</a></li>
              <li><a href="https://ksb.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saffron-600">Kendriya Sainik Board</a></li>
              <li><a href="https://sparsh.defencepension.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saffron-600">SPARSH Pension</a></li>
              <li><a href="https://echs.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saffron-600">ECHS Healthcare</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-army-100 pt-6 text-xs text-army-400 dark:border-white/10">
          This is an independent information aggregator and is not an official government website.
          Always verify details and apply through the linked official sources.
        </p>
      </div>
    </footer>
  )
}
