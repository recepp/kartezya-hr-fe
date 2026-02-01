"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Table, Button, Badge, Container } from 'react-bootstrap';
import { employeeService } from '@/services';
import { Employee } from '@/models/hr/common.types';
import { PageHeading } from '@/widgets';
import Pagination from '@/components/Pagination';
import EmployeeModal from '@/components/modals/EmployeeModal';
import DeleteModal from '@/components/DeleteModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Edit, Trash2, Eye, ChevronUp, ChevronDown } from 'react-feather';
import { toast } from 'react-toastify';
import { translateErrorMessage } from '@/helpers/ErrorUtils';
import '@/styles/table-list.scss';
import '@/styles/components/table-common.scss';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [sortConfig, setSortConfig] = useState<{
    key: 'first_name' | 'last_name' | null;
    direction: 'ASC' | 'DESC';
  }>({
    key: null,
    direction: 'ASC'
  });

  const router = useRouter();

  const fetchEmployees = async (page: number = 1, sortKey?: string, sortDir?: 'ASC' | 'DESC') => {
    try {
      setIsLoading(true);

      const response = await employeeService.getAll({ 
        page, 
        limit: itemsPerPage,
        sort: sortKey,
        direction: sortDir
      });
      
      if (response.data) {
        setEmployees(response.data);
        setTotalPages(response.page?.total_pages || 1);
        setTotalItems(response.page?.total || 0);
        setCurrentPage(page);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Veri çekme sırasında hata oluştu';
      toast.error(translateErrorMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(1);
  }, []);

  const handleSort = (key: 'first_name' | 'last_name') => {
    let direction: 'ASC' | 'DESC' = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key, direction });
    fetchEmployees(1, key, direction);
  };

  const getSortIcon = (columnKey: 'first_name' | 'last_name') => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'ASC' ?
      <ChevronUp size={16} className="ms-1" style={{ display: 'inline' }} /> :
      <ChevronDown size={16} className="ms-1" style={{ display: 'inline' }} />;
  };

  const handleView = (employee: Employee) => {
    router.push(`/employees/${employee.id}`);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedEmployee) {
      setDeleteLoading(true);
      try {
        await employeeService.delete(selectedEmployee.id);
        toast.success('Çalışan başarıyla silindi');
        fetchEmployees(currentPage, sortConfig.key || undefined, sortConfig.direction);
        setShowDeleteModal(false);
        setSelectedEmployee(null);
      } catch (error: any) {
        let errorMessage = '';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data) {
          errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Silme işlemi sırasında bir hata oluştu';
        }
        
        const translatedError = translateErrorMessage(errorMessage);
        toast.error(translatedError);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleModalSave = () => {
    fetchEmployees(currentPage, sortConfig.key || undefined, sortConfig.direction);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setIsEdit(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  const handlePageChange = (newPage: number) => {
    fetchEmployees(newPage, sortConfig.key || undefined, sortConfig.direction);
  };

  return (
    <>
      <Container fluid className="page-container">
        <LoadingOverlay show={isLoading} message="Çalışanlar yükleniyor..." />
        
        <div className="page-heading-wrapper">
          <PageHeading 
            heading="Çalışanlar"
            showCreateButton={true}
            showFilterButton={false}
            createButtonText="Yeni Çalışan"
            onCreate={handleAddNew}
          />
        </div>

        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="table-wrapper">
              <Card className="border-0 shadow-sm position-relative">
                <Card.Body className="p-0">
                  <div className="table-box">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th 
                              onClick={() => handleSort('first_name')}
                              className="sortable-header"
                            >
                              Ad Soyad {getSortIcon('first_name')}
                            </th>
                            <th>Çalıştığı Şirket</th>
                            <th>Departman</th>
                            <th>Manager</th>
                            <th>Statü</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.length ? (
                            employees.map((employee: Employee) => (
                              <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.first_name} {employee.last_name}</td>
                                <td>{employee.work_information?.company_name || '-'}</td>
                                <td>{employee.work_information?.department_name || '-'}</td>
                                <td>{employee.work_information?.manager || '-'}</td>
                                <td>
                                  <Badge bg="success">Aktif</Badge>
                                </td>
                                <td>
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleView(employee)}
                                  >
                                    <Eye size={14} />
                                  </Button>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(employee)}
                                  >
                                    <Edit size={14} />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteClick(employee)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-4">
                                  Veri bulunamadı
                                </td>
                              </tr>
                            
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {totalPages > 1 && !isLoading && (
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12}>
              <div className="px-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </Col>
          </Row>
        )}

        <EmployeeModal
          show={showModal}
          onHide={handleCloseModal}
          onSave={handleModalSave}
          employee={selectedEmployee}
          isEdit={isEdit}
        />

        {showDeleteModal && (
          <DeleteModal
            onClose={handleCloseDeleteModal}
            onHandleDelete={handleDelete}
            loading={deleteLoading}
          />
        )}
      </Container>
    </>
  );
};

export default EmployeesPage;