// src/components/Footer/Footer.jsx
import { GitBranch, Code2, X } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-brand-name">Hustler 2.0</span>
        <span className="footer-brand-tag">Job Hunt Tracker</span>
      </div>

      <div className="footer-center">
        Stay consistent. Every session counts.
      </div>

      <div className="footer-right">
        <a className="footer-link" href="https://github.com/AmanAshutosh" target="_blank" rel="noreferrer" aria-label="GitHub">
          <GitBranch size={13} />
        </a>
        <a className="footer-link" href="https://leetcode.com/u/CodeKarm/" target="_blank" rel="noreferrer" aria-label="LeetCode">
          <Code2 size={13} />
        </a>
        <a className="footer-link" href="https://x.com/CodeKarm" target="_blank" rel="noreferrer" aria-label="X / Twitter">
          <X size={13} />
        </a>
        <span className="footer-copy">© {year}</span>
      </div>
    </footer>
  );
}
