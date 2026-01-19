'use client'
import { Fragment, useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { dashboardService, DashboardData, GenderChartData, PositionChartData, CompanyDepartmentChartData } from "@/services/dashboard.service";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "react-toastify";

const Home = () => {
    const [stats, setStats] = useState<DashboardData>({
        total_employees: 0,
        total_departments: 0,
        total_companies: 0,
        pending_leave_requests: 0
    });
    const [genderData, setGenderData] = useState<GenderChartData[]>([]);
    const [positionData, setPositionData] = useState<PositionChartData[]>([]);
    const [companyDeptData, setCompanyDeptData] = useState<CompanyDepartmentChartData[]>([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

    useEffect(() => {
        fetchAllDashboardData();
    }, []);

    const fetchAllDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch main dashboard data
            const mainResponse = await dashboardService.getDashboardData();
            if (mainResponse.success && mainResponse.data) {
                setStats(mainResponse.data);
            }

            // Fetch gender chart data
            try {
                const genderResponse = await dashboardService.getEmployeesByGender();
                if (genderResponse.success && genderResponse.data) {
                    setGenderData(genderResponse.data);
                }
            } catch (error) {
                console.error('Error fetching gender data:', error);
            }

            // Fetch position chart data
            try {
                const positionResponse = await dashboardService.getEmployeesByPosition();
                if (positionResponse.success && positionResponse.data) {
                    setPositionData(positionResponse.data);
                }
            } catch (error) {
                console.error('Error fetching position data:', error);
            }

            // Fetch company-department chart data
            try {
                const companyDeptResponse = await dashboardService.getEmployeesByCompanyDepartment();
                if (companyDeptResponse.success && companyDeptResponse.data) {
                    setCompanyDeptData(companyDeptResponse.data);
                }
            } catch (error) {
                console.error('Error fetching company-department data:', error);
            }
        } catch (error: any) {
            console.error('Dashboard veri yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container fluid className="px-6 py-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </Spinner>
                </div>
            </Container>
        );
    }

    return (
        <Fragment>
            <Container fluid className="px-6 py-4">
                <Row>
                    <Col xl={3} lg={6} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="mb-0">Toplam Çalışan</h4>
                                    </div>
                                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                                        <i className="fe fe-users fs-4"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="fw-bold">{stats.total_employees}</h1>
                                    <p className="mb-0">
                                        <span className="text-success me-2">
                                            <i className="fe fe-trending-up me-1"></i>
                                        </span>
                                        Aktif çalışanlar
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="mb-0">Şirketler</h4>
                                    </div>
                                    <div className="icon-shape icon-md bg-light-danger text-danger rounded-2">
                                        <i className="fe fe-building fs-4"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="fw-bold">{stats.total_companies}</h1>
                                    <p className="mb-0">
                                        <span className="text-dark me-2">
                                            <i className="fe fe-building me-1"></i>
                                        </span>
                                        Toplam şirket
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="mb-0">Departmanlar</h4>
                                    </div>
                                    <div className="icon-shape icon-md bg-light-warning text-warning rounded-2">
                                        <i className="fe fe-briefcase fs-4"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="fw-bold">{stats.total_departments}</h1>
                                    <p className="mb-0">
                                        <span className="text-dark me-2">
                                            <i className="fe fe-users me-1"></i>
                                        </span>
                                        Toplam departman
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="mb-0">Onay Bekleyen İzinler</h4>
                                    </div>
                                    <div className="icon-shape icon-md bg-light-info text-info rounded-2">
                                        <i className="fe fe-calendar fs-4"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="fw-bold">{stats.pending_leave_requests}</h1>
                                    <p className="mb-0">
                                        <span className="text-info me-2">
                                            <i className="fe fe-clock me-1"></i>
                                        </span>
                                        Onay bekleyen
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Charts Row */}
                <Row className="mt-4">
                    {/* Gender Chart */}
                    <Col lg={4} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Header>
                                <h5 className="mb-0">Cinsiyete Göre Çalışan Sayısı</h5>
                            </Card.Header>
                            <Card.Body>
                                {genderData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={genderData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ gender, count }: any) => `${gender}: ${count}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {genderData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center text-muted py-5">
                                        <p>Veri bulunamadı</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Position Chart */}
                    <Col lg={4} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Header>
                                <h5 className="mb-0">Pozisyona Göre Çalışan Sayısı</h5>
                            </Card.Header>
                            <Card.Body>
                                {positionData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={positionData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="position_title" angle={-45} textAnchor="end" height={80} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center text-muted py-5">
                                        <p>Veri bulunamadı</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Company-Department Chart */}
                    <Col lg={4} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Header>
                                <h5 className="mb-0">Şirket-Departmana Göre Çalışan Sayısı</h5>
                            </Card.Header>
                            <Card.Body>
                                {companyDeptData.length > 0 ? (
                                    <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Şirket</th>
                                                    <th>Departman</th>
                                                    <th>Sayı</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {companyDeptData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.company_name}</td>
                                                        <td>{item.department_name}</td>
                                                        <td>
                                                            <span className="badge bg-primary">{item.count}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-5">
                                        <p>Veri bulunamadı</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12} md={12} xs={12} className="mb-6">
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">Kartezya HR Yönetim Sistemine Hoşgeldiniz</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <p>
                                    Bu sistem ile çalışanlarınızı, departmanlarınızı ve izin süreçlerinizi kolayca yönetebilirsiniz.
                                </p>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <h6>👥 Çalışan Yönetimi</h6>
                                        <p className="text-muted">Çalışan bilgilerini ekleyin, düzenleyin ve yönetin.</p>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <h6>🏢 Departman Yönetimi</h6>
                                        <p className="text-muted">Departmanları organize edin ve pozisyonları belirleyin.</p>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <h6>📅 İzin Yönetimi</h6>
                                        <p className="text-muted">İzin taleplerini onaylayın ve raporlayın.</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
export default Home;
