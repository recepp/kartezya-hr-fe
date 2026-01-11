import React from 'react';
import PrepareTable from './PrepareTable';
import TableActions from './TableActions';
import StatusBadge, { UserAvatar, DateDisplay } from './StatusBadge';
import { Badge } from 'react-bootstrap';

// Example usage component showing how to use the improved table components
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  startDate: string;
  avatar?: string;
}

interface EmployeeTableExampleProps {
  employees: Employee[];
  page?: any;
  onPageChange: (page: number) => void;
}

const EmployeeTableExample: React.FC<EmployeeTableExampleProps> = ({
  employees,
  page,
  onPageChange
}) => {
  const headItems = [
    'Çalışan',
    'E-posta',
    'Departman',
    'Pozisyon',
    'Durum',
    'Başlangıç Tarihi',
    'İşlemler'
  ];

  const handleEdit = (employee: Employee) => {
    console.log('Edit employee:', employee);
  };

  const handleDelete = (employee: Employee) => {
    console.log('Delete employee:', employee);
  };

  const handleView = (employee: Employee) => {
    console.log('View employee:', employee);
  };

  const tableContent = employees.map((employee) => (
    <tr key={employee.id} className="align-middle">
      <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
        <div className="d-flex align-items-center gap-3">
          <UserAvatar 
            name={employee.name} 
            imageUrl={employee.avatar}
            size={40}
          />
          <div>
            <div className="fw-semibold text-dark mb-1">{employee.name}</div>
            <small className="text-muted">ID: {employee.id}</small>
          </div>
        </div>
      </td>
      
      <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
        <span className="text-muted">{employee.email}</span>
      </td>
      
      <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
        <Badge 
          bg="light" 
          text="dark" 
          className="px-3 py-2 fw-normal"
          style={{ fontSize: '0.85rem' }}
        >
          {employee.department}
        </Badge>
      </td>
      
      <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
        <span className="fw-medium text-dark">{employee.position}</span>
      </td>
      
      <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
        <StatusBadge 
          status={employee.status} 
          showIcon={true}
        />
      </td>
      
      <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
        <DateDisplay 
          date={employee.startDate} 
          format="short"
          showIcon={true}
        />
      </td>
      
      <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
        <TableActions
          onView={() => handleView(employee)}
          onEdit={() => handleEdit(employee)}
          onDelete={() => handleDelete(employee)}
          showView={true}
          showEdit={true}
          showDelete={true}
        />
      </td>
    </tr>
  ));

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom py-3">
        <h5 className="card-title mb-0 text-dark fw-bold">Çalışan Listesi</h5>
        <p className="text-muted mb-0 mt-1">Tüm çalışanları görüntüleyin ve yönetin</p>
      </div>
      <div className="card-body p-0">
        <PrepareTable
          headItems={headItems}
          content={tableContent}
          page={page}
          onHandlePageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default EmployeeTableExample;