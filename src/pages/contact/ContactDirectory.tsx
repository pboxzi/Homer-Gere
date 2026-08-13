import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Mail,
  Newspaper,
  Handshake,
  Clapperboard,
  Calendar,
  Heart,
  Headphones,
  Clock,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { CONTACT_DEPARTMENTS, ContactDepartment } from '../../data/contactData';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Mail,
  Newspaper,
  Handshake,
  Clapperboard,
  Calendar,
  Heart,
  Headphones,
};

interface ContactDirectoryProps {
  onSelectDepartment: (departmentId: string) => void;
}

export const ContactDirectory: React.FC<ContactDirectoryProps> = ({ onSelectDepartment }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Departments
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Contact Directory
          </h2>
          <p className="text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Choose the department that best fits your enquiry. Each team is dedicated
            to providing prompt, professional responses.
          </p>
        </motion.div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTACT_DEPARTMENTS.map((dept, index) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              index={index}
              isInView={isInView}
              onSelect={() => onSelectDepartment(dept.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface DepartmentCardProps {
  department: ContactDepartment;
  index: number;
  isInView: boolean;
  onSelect: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  index,
  isInView,
  onSelect,
}) => {
  const Icon = ICON_MAP[department.icon] || Mail;

  return (
    <motion.button
      onClick={onSelect}
      className="group text-left rounded-2xl p-6 sm:p-7 hover:bg-[#F3F1ED]/60 transition-all duration-500 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500">
          <Icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-[#A6852F]/40 group-hover:text-[#A6852F] group-hover:translate-x-1 transition-all duration-300 mt-4" />
      </div>

      <h3 className="text-lg font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 mb-2">
        {department.name}
      </h3>

      <p className="text-sm text-[#57534E] leading-relaxed mb-5">
        {department.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#57534E]">
          <Mail className="w-3.5 h-3.5 text-[#A6852F]/60" />
          <span>{department.email}</span>
        </div>
        {department.phone && (
          <div className="flex items-center gap-2 text-xs text-[#57534E]">
            <Phone className="w-3.5 h-3.5 text-[#A6852F]/60" />
            <span>{department.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-[#57534E]">
          <Clock className="w-3.5 h-3.5 text-[#A6852F]/60" />
          <span>{department.responseTime}</span>
        </div>
      </div>
    </motion.button>
  );
};
