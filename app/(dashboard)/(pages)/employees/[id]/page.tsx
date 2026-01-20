"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Spinner, Row, Col, Card } from 'react-bootstrap';
import { employeeService } from '@/services';
import { Employee } from '@/models/hr/common.types';
import { toast } from 'react-toastify';
import { translateErrorMessage } from '@/helpers/ErrorUtils';
import LeftProfileColumn from '@/components/employee-detail/LeftProfileColumn';
import EmployeeInfoCard from '@/components/employee-detail/EmployeeInfoCard';
import ActivityChart from '@/components/employee-detail/ActivityChart';
import ProjectCard from '@/components/employee-detail/ProjectCard';
import styles from './page.module.scss';

const EmployeeDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setIsLoading(true);
      const response = await employeeService.getById(parseInt(employeeId));
      
      if (response?.data) {
        setEmployee(response.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Veri çekme sırasında hata oluştu';
      toast.error(translateErrorMessage(errorMessage));
      router.push('/employees');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className={styles.notFoundContainer}>
        <h5>Çalışan bulunamadı</h5>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/employees')}
        >
          Çalışanlara Dön
        </button>
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return '-';
    }
  };

  // Mock projects data
  const projects = [
    {
      title: 'Uplift Array',
      dueDate: 'Dec 15, 2025',
      progress: 70,
      teamMembers: [
        { initials: 'JD', name: 'John Doe' },
        { initials: 'JA', name: 'Jane Anderson' },
        { initials: 'BR', name: 'Bob Robinson' },
      ],
      lastUpdated: 'Today',
      isCompleted: false,
    },
    {
      title: 'Mobile App Design',
      completedDate: 'Jan 10, 2026',
      progress: 100,
      teamMembers: [
        { initials: 'AL', name: 'Alice Lee' },
        { initials: 'CM', name: 'Charlie Martin' },
      ],
      lastUpdated: 'Jan 10, 2026',
      isCompleted: true,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Left Profile Column - Hide on mobile */}
      <div style={{ display: 'none' }} className="d-none d-lg-block">
        <LeftProfileColumn 
          employee={{
            name: `${employee.first_name} ${employee.last_name}`,
            jobTitle: employee.work_information?.job_title || '-',
            initials: getInitials(employee.first_name, employee.last_name),
            company: employee.work_information?.company_name || '-',
            department: employee.work_information?.department_name || '-',
            manager: employee.work_information?.manager || '-',
            email: employee.email,
            phone: employee.phone || '-',
            address: employee.address || '-',
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <Container fluid className={styles.contentWrapper}>
          {/* Employee Name Header - Show on mobile only */}
          <div className="d-lg-none mb-4 pt-3">
            <h3 className="mb-0">{employee.first_name} {employee.last_name}</h3>
            <p className="text-muted mb-0">{employee.work_information?.job_title || '-'}</p>
          </div>

          {/* Employee Information Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Çalışan Bilgileri</h2>
            <div className={styles.cardGrid}>
              <Card className="border-0 shadow-sm" style={{ gridColumn: '1 / -1' }}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Ad Soyad</label>
                        <p className="mb-2">{employee.first_name} {employee.last_name}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Adres</label>
                        <p className="mb-2">{employee.address || '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>E-posta</label>
                        <p className="mb-2">{employee.email}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Şirket E-posta</label>
                        <p className="mb-2">{employee.company_email || '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Doğum Tarihi</label>
                        <p className="mb-2">{employee.date_of_birth ? formatDate(employee.date_of_birth) : '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Telefon</label>
                        <p className="mb-0">{employee.phone || '-'}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Şirket</label>
                        <p className="mb-2">{employee.work_information?.company_name || '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pozisyon</label>
                        <p className="mb-2">{employee.work_information?.job_title || '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Departman</label>
                        <p className="mb-2">{employee.work_information?.department_name || '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Yönetici</label>
                        <p className="mb-2">{employee.work_information?.manager || '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>İşe Başlama Tarihi</label>
                        <p className="mb-2">{employee.hire_date ? formatDate(employee.hire_date) : '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="d-block" style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>İşten Ayrılma Tarihi</label>
                        <p className="mb-0">{employee.work_information?.end_date ? formatDate(employee.work_information.end_date) : '-'}</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Activity Chart Section */}
          <div className={styles.section}>
            <ActivityChart />
          </div>

          {/* Projects Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Projeler</h2>

            {/* Ongoing Projects */}
            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Devam Eden Projeler</h3>
              <div className={styles.projectGrid}>
                {projects
                  .filter((p) => !p.isCompleted)
                  .map((project, index) => (
                    <ProjectCard key={index} {...project} />
                  ))}
              </div>
            </div>

            {/* Completed Projects */}
            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Tamamlanan Projeler</h3>
              <div className={styles.projectGrid}>
                {projects
                  .filter((p) => p.isCompleted)
                  .map((project, index) => (
                    <ProjectCard key={index} {...project} />
                  ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
