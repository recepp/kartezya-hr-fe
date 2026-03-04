"use client";
import React, { useState } from 'react';
import {
  Row, Col, Card, Table, Button, Badge, Container, Form, Collapse,
} from 'react-bootstrap';
import { cvSearchService } from '@/services';
import type {
  FusedCandidateResponse,
  HybridSearchResponse,
} from '@/models/cv-search/cv-search.models';
import { PageHeading } from '@/widgets';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Search, ChevronDown, ChevronUp } from 'react-feather';
import { toast } from 'react-toastify';
import '@/styles/table-list.scss';
import '@/styles/components/table-common.scss';

const scoreColor = (score: number): string => {
  if (score >= 0.7) return '#198754';
  if (score >= 0.4) return '#fd7e14';
  return '#6c757d';
};

const CvSearchPage = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [meta, setMeta] = useState<Omit<HybridSearchResponse, 'candidates' | 'config'> | null>(null);
  const [results, setResults] = useState<FusedCandidateResponse[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.warning('Lütfen bir arama sorgusu girin.');
      return;
    }
    setIsSearching(true);
    setResults([]);
    setExpandedRows(new Set());
    setMeta(null);
    try {
      const response = await cvSearchService.hybridSearch(trimmed);
      setResults(response.candidates || []);
      setMeta({
        total_found: response.total_found,
        processing_time: response.processing_time,
        method: response.method,
        query: response.query,
      });
      if ((response.candidates || []).length === 0) {
        toast.info('Arama kriterlerine uygun aday bulunamadı.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Arama sırasında bir hata oluştu.';
      toast.error(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSearch();
    }
  };

  const toggleRow = (rank: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rank)) {
        next.delete(rank);
      } else {
        next.add(rank);
      }
      return next;
    });
  };

  const currentCompany = (c: FusedCandidateResponse) =>
    c.companies?.find((co) => co.is_current)?.name ||
    c.companies?.[0]?.name ||
    '—';

  const topSkills = (c: FusedCandidateResponse) =>
    c.skills
      ?.slice(0, 5)
      .map((s) => s.name)
      .join(', ') || '—';

  return (
    <Container fluid className="page-container">
      <LoadingOverlay show={isSearching} message="Aranıyor…" />

      <div className="page-heading-wrapper">
        <PageHeading
          heading="CV Arama"
          showCreateButton={false}
          showFilterButton={false}
        />
      </div>

      {/* Search input */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form.Group>
                <Form.Label className="fw-semibold mb-2">
                  Arama Sorgusu
                  <span className="text-muted fw-normal small ms-2">
                    (Ctrl+Enter ile arayın)
                  </span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Örn: 5 yıl deneyimli backend geliştirici, Python ve PostgreSQL bilen, tercihen İstanbul'da"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown as any}
                  disabled={isSearching}
                  style={{ resize: 'vertical' }}
                />
              </Form.Group>
              <div className="mt-3">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                >
                  <Search size={16} className="me-1" />
                  Ara
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Results */}
      {meta && (
        <Row>
          <Col lg={12}>
            {/* Meta row */}
            <div className="d-flex align-items-center gap-3 mb-2 px-1">
              <span className="fw-semibold">{meta.total_found} aday bulundu</span>
              <span className="text-muted small">·</span>
              <span className="text-muted small">{meta.processing_time}</span>
              <span className="text-muted small">·</span>
              <Badge bg="secondary" className="fw-normal">{meta.method}</Badge>
            </div>

            <div className="table-wrapper">
              <Card className="border-0 shadow-sm position-relative">
                <Card.Body className="p-0">
                  <div className="table-box">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: 50 }}>Sıra</th>
                            <th>Ad</th>
                            <th>Mevcut Pozisyon</th>
                            <th style={{ width: 110 }}>Kıdem</th>
                            <th style={{ width: 90 }}>Deneyim</th>
                            <th>Beceriler</th>
                            <th>Şirket</th>
                            <th style={{ width: 110 }}>Fusion Skoru</th>
                            <th style={{ width: 100 }}>LLM Skoru</th>
                            <th style={{ width: 80 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.length > 0 ? (
                            results.map((candidate) => {
                              const isExpanded = expandedRows.has(candidate.rank);
                              return (
                                <>
                                  <tr key={`row-${candidate.rank}`}>
                                    <td className="text-center fw-semibold">
                                      {candidate.rank}
                                    </td>
                                    <td className="fw-semibold">
                                      {candidate.name || '—'}
                                    </td>
                                    <td className="text-muted small">
                                      {candidate.current_position || '—'}
                                    </td>
                                    <td className="small">
                                      {candidate.seniority || '—'}
                                    </td>
                                    <td className="text-center small">
                                      {candidate.total_experience_years != null
                                        ? `${candidate.total_experience_years} yıl`
                                        : '—'}
                                    </td>
                                    <td className="small text-muted">
                                      {topSkills(candidate)}
                                    </td>
                                    <td className="small">
                                      {currentCompany(candidate)}
                                    </td>
                                    <td>
                                      <span
                                        className="fw-semibold"
                                        style={{
                                          color: scoreColor(candidate.fusion_score),
                                        }}
                                      >
                                        {candidate.fusion_score != null
                                          ? candidate.fusion_score.toFixed(3)
                                          : '—'}
                                      </span>
                                    </td>
                                    <td>
                                      <span
                                        style={{
                                          color: scoreColor(candidate.llm_score),
                                        }}
                                      >
                                        {candidate.llm_score != null
                                          ? candidate.llm_score.toFixed(3)
                                          : '—'}
                                      </span>
                                    </td>
                                    <td>
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => toggleRow(candidate.rank)}
                                        title="Detay"
                                      >
                                        {isExpanded ? (
                                          <ChevronUp size={14} />
                                        ) : (
                                          <ChevronDown size={14} />
                                        )}
                                      </Button>
                                    </td>
                                  </tr>

                                  {isExpanded && (
                                    <tr key={`detail-${candidate.rank}`} className="table-light">
                                      <td colSpan={10} className="p-3">
                                        <Row>
                                          {/* LLM Reasoning */}
                                          <Col md={6}>
                                            <p className="fw-semibold mb-1 small">LLM Gerekçesi</p>
                                            <p
                                              className="small text-muted mb-0"
                                              style={{ whiteSpace: 'pre-wrap' }}
                                            >
                                              {candidate.llm_reasoning || 'Gerekçe mevcut değil.'}
                                            </p>
                                          </Col>

                                          {/* Company history */}
                                          <Col md={3}>
                                            <p className="fw-semibold mb-1 small">Şirket Geçmişi</p>
                                            {candidate.companies && candidate.companies.length > 0 ? (
                                              <ul className="list-unstyled mb-0">
                                                {candidate.companies.map((co, ci) => (
                                                  <li key={ci} className="small text-muted mb-1">
                                                    <span
                                                      className={co.is_current ? 'fw-semibold text-dark' : ''}
                                                    >
                                                      {co.name}
                                                    </span>
                                                    {co.position && (
                                                      <span className="ms-1 text-secondary">
                                                        — {co.position}
                                                      </span>
                                                    )}
                                                    {co.is_current && (
                                                      <Badge bg="success" className="ms-1 small">
                                                        Güncel
                                                      </Badge>
                                                    )}
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : (
                                              <span className="small text-muted">—</span>
                                            )}
                                          </Col>

                                          {/* All skills */}
                                          <Col md={3}>
                                            <p className="fw-semibold mb-1 small">Tüm Beceriler</p>
                                            {candidate.skills && candidate.skills.length > 0 ? (
                                              <div className="d-flex flex-wrap gap-1">
                                                {candidate.skills.map((sk, si) => (
                                                  <Badge
                                                    key={si}
                                                    bg="light"
                                                    text="dark"
                                                    className="border small"
                                                    title={
                                                      sk.years_of_experience
                                                        ? `${sk.years_of_experience} yıl deneyim`
                                                        : undefined
                                                    }
                                                  >
                                                    {sk.name}
                                                    {sk.proficiency && (
                                                      <span className="text-muted ms-1">
                                                        · {sk.proficiency}
                                                      </span>
                                                    )}
                                                  </Badge>
                                                ))}
                                              </div>
                                            ) : (
                                              <span className="small text-muted">—</span>
                                            )}
                                          </Col>
                                        </Row>

                                        {/* Score breakdown */}
                                        <Row className="mt-3">
                                          <Col>
                                            <div className="d-flex flex-wrap gap-3">
                                              {[
                                                { label: 'Vektör', value: candidate.vector_score },
                                                { label: 'BM25', value: candidate.bm25_score },
                                                { label: 'Graf', value: candidate.graph_score },
                                                { label: 'LLM', value: candidate.llm_score },
                                                { label: 'Fusion', value: candidate.fusion_score },
                                              ].map((sc) => (
                                                <div key={sc.label} className="text-center">
                                                  <div
                                                    className="small fw-semibold"
                                                    style={{ color: scoreColor(sc.value) }}
                                                  >
                                                    {sc.value != null ? sc.value.toFixed(3) : '—'}
                                                  </div>
                                                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    {sc.label}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </Col>
                                        </Row>
                                      </td>
                                    </tr>
                                  )}
                                </>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={10} className="text-center py-5 text-muted">
                                Arama sonucu bulunamadı
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
      )}
    </Container>
  );
};

export default CvSearchPage;
