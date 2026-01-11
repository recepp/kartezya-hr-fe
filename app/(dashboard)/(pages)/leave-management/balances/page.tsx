"use client";
import { Row, Col, Card, Table, Form } from 'react-bootstrap';
import { leaveBalanceService } from '@/services';
import { LeaveBalance } from '@/models/hr/common.types';
import Pagination from '@/components/Pagination';
import LoadingOverlay from '@/components/LoadingOverlay';
import { User, ChevronUp, ChevronDown } from 'react-feather';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const LeaveBalancesPage = () => {
  const [data, setData] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: 'employee' | 'leaveType' | 'remaining' | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  const fetchLeaveBalances = async () => {
    try {
      setIsLoading(true);
      const response = await leaveBalanceService.getMyLeaveBalances();
      setData(response.data || []);
    } catch (error: any) {
      console.error('Error fetching leave balances:', error);
      toast.error('İzin bakiyeleri yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: 'employee' | 'leaveType' | 'remaining') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: 'employee' | 'leaveType' | 'remaining') => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ?
      <ChevronUp size={16} className="ms-1" style={{ display: 'inline' }} /> :
      <ChevronDown size={16} className="ms-1" style={{ display: 'inline' }} />;
  };

  const getFilteredAndSortedBalances = () => {
    if (!data) return [];

    let filteredBalances = [...data];

    if (searchFilter.trim()) {
      filteredBalances = filteredBalances.filter((balance: any) =>
        balance.employee?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        balance.leaveType?.name?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filteredBalances.sort((a: any, b: any) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (sortConfig.key) {
          case 'employee':
            aValue = a.employee?.name || '';
            bValue = b.employee?.name || '';
            break;
          case 'leaveType':
            aValue = a.leaveType?.name || '';
            bValue = b.leaveType?.name || '';
            break;
          case 'remaining':
            aValue = a.remainingDays || 0;
            bValue = b.remainingDays || 0;
            break;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortConfig.direction === 'asc') {
            return aValue.localeCompare(bValue, 'tr');
          } else {
            return bValue.localeCompare(aValue, 'tr');
          }
        } else {
          if (sortConfig.direction === 'asc') {
            return (aValue as number) - (bValue as number);
          } else {
            return (bValue as number) - (aValue as number);
          }
        }
      });
    }

    return filteredBalances;
  };

  const filteredAndSortedBalances = getFilteredAndSortedBalances();

  return (
    <>
      <style jsx global>{`
        #page-content {
          background-color: #f5f7fa;
          min-height: 100vh;
        }
      `}</style>

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
            <h4 className="mb-0">İzin Bakiyeleri</h4>
            <Form.Check
              type="checkbox"
              checked={showFilters}
              onChange={(e) => setShowFilters(e.target.checked)}
              label="Filtreleri Göster"
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="px-3">
            <Card className="border-0 shadow-sm position-relative">
              <LoadingOverlay show={isLoading} message="İzin bakiyeleri yükleniyor..." />
              
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
                          <th
                            onClick={() => handleSort('leaveType')}
                            className="sortable-header"
                          >
                            İzin Türü {getSortIcon('leaveType')}
                          </th>
                          <th>Toplam Gün</th>
                          <th>Kullanılan</th>
                          <th
                            onClick={() => handleSort('remaining')}
                            className="sortable-header"
                          >
                            Kalan {getSortIcon('remaining')}
                          </th>
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
                            </td>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {filteredAndSortedBalances.length ? (
                          filteredAndSortedBalances.map((balance: any) => (
                            <tr key={balance.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <User size={16} className="me-2 text-muted" />
                                  {balance.employee?.name || '-'}
                                </div>
                              </td>
                              <td>{balance.leaveType?.name || '-'}</td>
                              <td>{balance.totalDays || 0} gün</td>
                              <td>{balance.usedDays || 0} gün</td>
                              <td>
                                <span className={`fw-bold ${balance.remainingDays > 0 ? 'text-success' : 'text-warning'}`}>
                                  {balance.remainingDays || 0} gün
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          !isLoading && (
                            <tr>
                              <td colSpan={5} className="text-center py-4">
                                {data?.length ? 'Arama kriterlerine uygun veri bulunamadı' : 'Veri bulunamadı'}
                              </td>
                            </tr>
                          )
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
    </>
  );
};

export default LeaveBalancesPage;