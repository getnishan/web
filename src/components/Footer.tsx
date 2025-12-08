import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Send } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-secondary text-white py-16 rounded-t-[3rem] mt-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-orange rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Logo className="text-white" />
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Prepare for the future with Aveti Learning’s fully residential cohort in Bhubaneswar.
              We blend expert mentorship, live projects, and community living to turn intention into
              measurable impact.
            </p>
            <div className="flex gap-4">
               {[
                 { Icon: Instagram, url: 'https://www.instagram.com/avetilearning/' },
                 { Icon: Facebook, url: 'https://www.facebook.com/AvetiLearningEducation/' },
                 { Icon: Linkedin, url: 'https://www.linkedin.com/company/avetilearning/' },
                 { Icon: Twitter, url: 'https://x.com/avetilearning' },
               ].map(({ Icon, url }, i) => (
                 <a key={i} href={url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Icon size={18}/>
                 </a>
               ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Program</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#program-overview" className="hover:text-primary transition-colors">Program Overview</a></li>
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Learning Tracks</a></li>
              <li><a href="#selection-process" className="hover:text-primary transition-colors">Selection Process</a></li>
              <li><a href="#nature-of-program" className="hover:text-primary transition-colors">Residential Life</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="https://avetilearning.com" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">Website</a></li>
              <li><a href="https://avetilearning.com/#/joinus/contactus" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">Join Us</a></li>
              <li><a href="https://avetilearning.com/blog" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">Stories</a></li>
              <li><a href="mailto:hr@shikhya.org" className="hover:text-primary transition-colors">Contact HR</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold mb-6 text-white text-lg">Contact Us</h4>
             <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-slate-300">
                   <MapPin size={20} className="mt-0.5 text-primary shrink-0" />
                   <span>Residential Campus, Bhubaneswar <br/>Odisha, India</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-300">
                   <Mail size={18} className="mt-0.5 text-primary shrink-0" />
                   <span>hr@shikhya.org</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-300">
                   <Send size={18} className="mt-0.5 text-primary shrink-0" />
                   <a href="https://avetilearning.com/#/joinus/contactus" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">Submit your details online</a>
                </div>
             </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2025 Aveti Learning. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white">Privacy Policy</a>
             <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
