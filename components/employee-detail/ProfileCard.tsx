"use client";
import { Mail, Phone, Calendar, ChevronRight } from 'react-feather';
import { Employee } from '@/models/hr/common.types';

interface ProfileCardProps {
  employee: Employee;
  onEdit: () => void;
}

const ProfileCard = ({ employee, onEdit }: ProfileCardProps) => {
  const infoRows = [
    { label: 'Department', value: 'Designer', clickable: true },
    { label: 'Team Leader', value: 'Jerome Bell', clickable: true },
  ];

  return (
    <div className="w-full max-w-sm">
      <style jsx>{`
        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .profile-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #624bff 0%, #a78bfa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          margin: 0 auto 16px;
          font-weight: bold;
        }
        .profile-name {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .profile-role {
          font-size: 14px;
          color: #6b7280;
        }
        .action-icons {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .action-button {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: none;
          background-color: #f3f4f6;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #624bff;
          transition: all 0.3s ease;
        }
        .action-button:hover {
          background-color: #624bff;
          color: white;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }
        .info-value {
          font-size: 13px;
          color: #1f2937;
          font-weight: 500;
        }
        .info-row.clickable {
          cursor: pointer;
        }
        .info-row.clickable:hover {
          background-color: #f9fafb;
        }
        .edit-button {
          width: 100%;
          padding: 12px;
          margin-top: 24px;
          background: linear-gradient(135deg, #624bff 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .edit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(98, 75, 255, 0.3);
        }
      `}</style>

      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar">
            {employee.first_name?.[0]}{employee.last_name?.[0]}
          </div>
          <div className="profile-name">{employee.first_name} {employee.last_name}</div>
          <div className="profile-role">UI/UX Designer</div>
          <div className="action-icons">
            <button className="action-button" title="Send Email">
              <Mail size={18} />
            </button>
            <button className="action-button" title="Call">
              <Phone size={18} />
            </button>
            <button className="action-button" title="Schedule">
              <Calendar size={18} />
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div>
          {infoRows.map((row, index) => (
            <div key={index} className={`info-row ${row.clickable ? 'clickable' : ''}`}>
              <span className="info-label">{row.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="info-value">{row.value}</span>
                {row.clickable && <ChevronRight size={16} color="#6b7280" />}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information Card */}
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            Contact Information
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{employee.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone</span>
            <span className="info-value">{employee.phone || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Address</span>
            <span className="info-value">{employee.address || '-'}</span>
          </div>
        </div>

        {/* Edit Button */}
        <button className="edit-button" onClick={onEdit}>
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
