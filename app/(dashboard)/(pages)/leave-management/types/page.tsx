"use client";
import { useState } from 'react';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { leaveTypeService } from '@/services';
import useApi from '@/hooks/useApi';
import Pagination from '@/components/Pagination';
import LoadingOverlay from '@/components/LoadingOverlay';
import DeleteModal from '@/components/DeleteModal';
import { Plus, Edit, Trash2, Calendar } from 'react-feather';
import { toast } from 'react-toastify';
import { translateErrorMessage } from '@/helpers/ErrorUtils';

const LeaveTypesPage = () => {
  const [{ data, isLoading, refetch, handlePageChange }] = useApi({ service: leaveTypeService });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = (leaveType: any) => {
    setSelectedType(leaveType);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedType) {
      setDeleteLoading(true);
      try {
        await leaveTypeService.delete(selectedType.id);
        toast.success('İzin türü başarıyla silindi');
        refetch();
        setShowDeleteModal(false);
        setSelectedType(null);
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

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedType(null);
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Card className="position-relative">
            <LoadingOverlay show={isLoading} message="İzin türleri yükleniyor..." />
            
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-1">İzin Türleri</h4>
                <Button variant="primary" size="sm" disabled={isLoading}>
                  <Plus size={16} className="me-1" />
                  Yeni İzin Türü
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>İzin Türü</th>
                    <th>Açıklama</th>
                    <th>Varsayılan Gün</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length ? (
                    data.data.map((leaveType: any) => (
                      <tr key={leaveType.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Calendar size={16} className="me-2 text-muted" />
                            {leaveType.name}
                          </div>
                        </td>
                        <td>{leaveType.description || '-'}</td>
                        <td>{leaveType.defaultDays || 0} gün</td>
                        <td>
                          <span className={`badge ${leaveType.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {leaveType.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            disabled={isLoading}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(leaveType)}
                            disabled={isLoading}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    !isLoading && (
                      <tr>
                        <td colSpan={5} className="text-center">Veri bulunamadı</td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
              
              {data?.page && !isLoading && (
                <Pagination
                  currentPage={data.page.page}
                  totalPages={data.page.total_pages}
                  totalItems={data.page.total}
                  itemsPerPage={data.page.limit}
                  onPageChange={handlePageChange}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showDeleteModal && (
        <DeleteModal
          onClose={handleCloseDeleteModal}
          onHandleDelete={handleDelete}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default LeaveTypesPage;