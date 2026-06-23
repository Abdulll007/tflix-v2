import React from 'react'


import { FaYoutube ,FaFacebook,FaTwitter,FaInstagram} from "react-icons/fa";
import Link from 'next/link'

const Footer = () => {
  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies?page=1' },
    { label: 'TV Shows', href: '/tv-shows?page=1' },
    // { label: 'Anime', href: '/anime' },
    { label: 'FAQ', href: '#' },
    { label: 'Help', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
  ]

  const socialLinks = [
    { icon: FaFacebook, href: '#' },
    { icon: FaTwitter, href: '#' },
    { icon: FaInstagram, href: '#' },
    { icon: FaYoutube, href: '#' },
  ]

  return (
    <footer className="bg-black dark:bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 mb-8">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <Link
                key={social.href}
                href={social.href}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Icon className="w-6 h-6" />
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800 mb-8"></div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; 2026 TFLIX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
