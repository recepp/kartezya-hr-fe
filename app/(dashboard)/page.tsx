'use client'
import { Fragment } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { PageHeading } from "@/widgets";

const Home = () => {
    return (
        <Fragment>
            <Container fluid className="px-6 py-4">
                <PageHeading heading="Dashboard" />
                
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
                                    <h1 className="fw-bold">-</h1>
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
                                        <h4 className="mb-0">Departmanlar</h4>
                                    </div>
                                    <div className="icon-shape icon-md bg-light-warning text-warning rounded-2">
                                        <i className="fe fe-briefcase fs-4"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="fw-bold">-</h1>
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
                                        <h4 className="mb-0">Bekleyen İzinler</h4>
                                    </div>
                                    <div className="icon-shape icon-md bg-light-info text-info rounded-2">
                                        <i className="fe fe-calendar fs-4"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="fw-bold">-</h1>
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

                    <Col xl={3} lg={6} md={12} xs={12} className="mb-6">
                        <Card className="border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="mb-0">Bu Ay İzinler</h4>
                                    </div>
                                    <div className="icon-shape icon-md bg-light-success text-success rounded-2">
                                        <i className="fe fe-check-circle fs-4"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="fw-bold">-</h1>
                                    <p className="mb-0">
                                        <span className="text-success me-2">
                                            <i className="fe fe-trending-up me-1"></i>
                                        </span>
                                        Onaylanan izinler
                                    </p>
                                </div>
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
