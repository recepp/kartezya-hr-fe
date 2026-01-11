"use client";
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { leaveRequestService } from '@/services';
import useApi from '@/hooks/useApi';
import Pagination from '@/components/Pagination';
import { Check, X, Filter, ChevronUp, ChevronDown } from 'react-feather';
import { LeaveRequest } from '@/models/hr/common.types';
import { useState } from 'react';

const LeaveRequestsPage = () => {
  const [{ data, isLoading, refetch, handlePageChange }] = useApi({ service: leaveRequestService });
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [sortConfig, setSortConfig] = useState<{
    key: 'employee' | 'startDate' | 'status' | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  const handleSort = (key: 'employee' | 'startDate' | 'status') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: 'employee' | 'startDate' | 'status') => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ?
      <ChevronUp size={16} className="ms-1" style={{ display: 'inline' }} /> :
      <ChevronDown size={16} className="ms-1" style={{ display: 'inline' }} />;
  };

  const getFilteredAndSortedRequests = () => {
    if (!data?.data) return [];

    let filteredRequests = [...data.data];

    if (searchFilter.trim()) {
      filteredRequests = filteredRequests.filter((request: LeaveRequest) =>
        `${request.employee?.firstName} ${request.employee?.lastName}`.toLowerCase().includes(searchFilter.toLowerCase()) ||
        request.leaveType?.name?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredRequests = filteredRequests.filter((request: LeaveRequest) =>
        request.status === statusFilter
      );
    }

    if (sortConfig.key) {
      filteredRequests.sort((a, b) => {
        let aValue: string | Date = '';
        let bValue: string | Date = '';

        switch (sortConfig.key) {
          case 'employee':
            aValue = `${a.employee?.firstName} ${a.employee?.lastName}`;
            bValue = `${b.employee?.firstName} ${b.employee?.lastName}`;
            break;
          case 'startDate':
            aValue = new Date(a.startDate);
            bValue = new Date(b.startDate);
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortConfig.direction === 'asc') {
            return aValue.localeCompare(bValue, 'tr');
          } else {
            return bValue.localeCompare(aValue, 'tr');
          }
        } else {
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
      });
    }

    return filteredRequests;
  };

  const filteredAndSortedRequests = getFilteredAndSortedRequests();

  const handleApprove = async (request: LeaveRequest) => {
    try {
      // await leaveRequestService.approve(request.id);
      console.log('Approve request:', request.id);
      refetch();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (request: LeaveRequest) => {
    try {
      // await leaveRequestService.reject(request.id);
      console.log('Reject request:', request.id);
      refetch();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <>
      <style jsx>{`
        .sortable-header {
          transition: background-color 0.2s ease;
          cursor: pointer;
          user-select: none;
        }
        .sortable-header:hover {
          background-color: rgba(98, 75, 255, 0.1) !important;
        }
        .table-box {
          border-radius: 8px;
          overflow: hidden;
          border: none;
          margin: 0;
        }
        .table-responsive {
          border-radius: 0;
          margin-bottom: 0;
        }
        table {
          margin-bottom: 0;
          table-layout: fixed;
          width: 100%;
        }
        table td, table th {
          padding: 12px 16px;
          vertical-align: middle;
          word-wrap: break-word;
        }
        table thead tr {
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
        }
        table thead tr:last-child td {
          padding: 12px 16px;
          background-color: white;
          border-bottom: none;
        }
        table thead tr:last-child .filter-input {
          width: 100%;
        }
      `}</style>

      <Row className="mb-4 px-3 pt-4">
        <Col lg={12} md={12} sm={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">İzin Talepleri</h4>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              disabled={isLoading}
            >
              <Filter size={16} />
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="px-3">
            <Card className="border-0 shadow-sm position-relative">
              <Card.Body className="p-0">
                <div className="table-box">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th
                            onClick={() => handleSort('employee')}
                            className="sortable-header"
                          >
                            Çalışan {getSortIcon('employee')}
                          </th>
                          <th>İzin Türü</th>
                          <th
                            onClick={() => handleSort('startDate')}
                            className="sortable-header"
                          >
                            Başlangıç {getSortIcon('startDate')}
                          </th>
                          <th>Bitiş</th>
                          <th
                            onClick={() => handleSort('status')}
                            className="sortable-header"
                          >
                            Durum {getSortIcon('status')}
                          </th>
                          <th>İşlemler</th>
                        </tr>
                        {showFilters && (
                          <tr>
                            <td className="border-top">
                              <Form.Control
                                type="text"
                                placeholder="Çalışan adı..."
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="filter-input"
                                size="sm"
                              />
                            </td>
                            <td className="border-top">
                            </td>
                            <td className="border-top">
                            </td>
                            <td className="border-top">
                            </td>
                            <td className="border-top">
                              <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                size="sm"
                              >
                                <option value="">Tümü</option>
                                <option value="PENDING">Bekliyor</option>
                                <option value="APPROVED">Onaylandı</option>
                                <option value="REJECTED">Reddedildi</option>
                              </Form.Select>
                            </td>
                            <td className="border-top">
                            </td>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {filteredAndSortedRequests.length ? (
                          filteredAndSortedRequests.map((request: LeaveRequest) => (
                            <tr key={request.id}>
                              <td>{request.employee?.firstName} {request.employee?.lastName}</td>
                              <td>{request.leaveType?.name}</td>
                              <td>{new Date(request.startDate).toLocaleDateString('tr-TR')}</td>
                              <td>{new Date(request.endDate).toLocaleDateString('tr-TR')}</td>
                              <td>
                                <span className={`badge bg-${
                                  request.status === 'APPROVED' ? 'success' : 
                                  request.status === 'REJECTED' ? 'danger' : 'warning'
                                }`}>
                                  {request.status === 'APPROVED' ? 'Onaylandı' : 
                                   request.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor'}
                                </span>
                              </td>
                              <td>
                                {request.status === 'PENDING' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="success" 
                                      className="me-2"
                                      onClick={() => handleApprove(request)}
                                      disabled={isLoading}
                                    >
                                      <Check size={14} />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="danger"
                                      onClick={() => handleReject(request)}
                                      disabled={isLoading}
                                    >
                                      <X size={14} />
                                    </Button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              {data?.data?.length ? 'Arama kriterlerine uygun veri bulunamadı' : 'Veri bulunamadı'}
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

      {data?.page && !isLoading && (
        <Row className="mt-4">
          <Col lg={12} md={12} sm={12}>
            <div className="px-3">
              <Pagination
                currentPage={data.page.page}
                totalPages={data.page.total_pages}
                totalItems={data.page.total}
                itemsPerPage={data.page.limit}
                onPageChange={handlePageChange}
              />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default LeaveRequestsPage;