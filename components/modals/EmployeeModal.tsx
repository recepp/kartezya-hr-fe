import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Employee } from '@/models/hr/common.types';
import { employeeService, lookupService } from '@/services';
import { CompanyLookup, DepartmentLookup, JobPositionLookup } from '@/services/lookup.service';
import { translateErrorMessage, getFieldErrorMessage } from '@/helpers/ErrorUtils';
import { toast } from 'react-toastify';
import LoadingOverlay from '@/components/LoadingOverlay';

interface EmployeeModalProps {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
  employee?: Employee | null;
  isEdit?: boolean;
}

const AVAILABLE_ROLES = ['ADMIN', 'EMPLOYEE', 'HR', 'FINANCE'];

interface FormData {
  email: string;
  company_email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  gender: string;
  date_of_birth: string;
  hire_date: string;
  total_experience: string;
  marital_status: string;
  emergency_contact: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  roles: string[];
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  show,
  onHide,
  onSave,
  employee = null,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    company_email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    gender: '',
    date_of_birth: '',
    hire_date: '',
    total_experience: '',
    marital_status: '',
    emergency_contact: '',
    emergency_contact_name: '',
    emergency_contact_relation: 'Diğer',
    roles: ['EMPLOYEE']
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        email: employee.email || '',
        company_email: (employee as any).company_email || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        phone: employee.phone || '',
        address: employee.address || '',
        state: employee.state || '',
        city: employee.city || '',
        gender: employee.gender || '',
        date_of_birth: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : '',
        hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : '',
        total_experience: employee.total_experience?.toString() || '',
        marital_status: employee.marital_status || '',
        emergency_contact: employee.emergency_contact || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_relation: employee.emergency_contact_relation || 'Diğer',
        roles: (employee as any).roles || ['EMPLOYEE']
      });
    } else {
      setFormData({
        email: '',
        company_email: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        state: '',
        city: '',
        gender: '',
        date_of_birth: '',
        hire_date: '',
        total_experience: '',
        marital_status: '',
        emergency_contact: '',
        emergency_contact_name: '',
        emergency_contact_relation: 'Diğer',
        roles: ['EMPLOYEE']
      });
    }
    setFieldErrors({});
  }, [show, employee, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'Ad zorunludur';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Soyad zorunludur';
    }
    if (!formData.company_email.trim()) {
      errors.company_email = 'Şirket e-posta zorunludur';
    } else if (!formData.company_email.includes('@')) {
      errors.company_email = 'Geçerli bir şirket e-posta giriniz';
    }
    if (!formData.email.trim()) {
      errors.email = 'E-posta zorunludur';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Geçerli bir e-posta giriniz';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Telefon zorunludur';
    }
    if (!formData.hire_date) {
      errors.hire_date = 'İşe başlama tarihi zorunludur';
    }
    if (formData.roles.length === 0) {
      errors.roles = 'En az bir rol seçiniz';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData: any = {
        email: formData.email.trim(),
        company_email: formData.company_email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        state: formData.state.trim(),
        city: formData.city.trim(),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || undefined,
        hire_date: formData.hire_date,
        total_experience: formData.total_experience ? parseFloat(formData.total_experience) : 0,
        marital_status: formData.marital_status,
        emergency_contact: formData.emergency_contact.trim(),
        emergency_contact_name: formData.emergency_contact_name.trim(),
        emergency_contact_relation: formData.emergency_contact_relation,
        roles: formData.roles
      };

      if (isEdit && employee) {
        await employeeService.update(employee.id, submitData);
        toast.success('Çalışan başarıyla güncellendi');
      } else {
        await employeeService.create(submitData);
        toast.success('Çalışan başarıyla oluşturuldu');
      }
      onSave();
      onHide();
    } catch (error: any) {
      let errorMessage = '';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Bir hata oluştu';
      }
      
      const translatedError = translateErrorMessage(errorMessage);
      toast.error(translatedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable className="employee-modal">
      <div className="position-relative">
        <LoadingOverlay show={loading} message="Kaydediliyor..." />
        
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? 'Çalışan Düzenle' : 'Yeni Çalışan'}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {/* Personal Information */}
            <h6 className="mb-3 text-secondary">Kişisel Bilgiler</h6>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ad <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Ad giriniz"
                    isInvalid={!!fieldErrors.first_name}
                  />
                  {fieldErrors.first_name && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                      {fieldErrors.first_name}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Soyad <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Soyad giriniz"
                    isInvalid={!!fieldErrors.last_name}
                  />
                  {fieldErrors.last_name && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                      {fieldErrors.last_name}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Şirket E-posta <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="company_email"
                    value={formData.company_email}
                    onChange={handleInputChange}
                    placeholder="companyemail@company.com"
                    isInvalid={!!fieldErrors.company_email}
                  />
                  {fieldErrors.company_email && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                      {fieldErrors.company_email}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>E-posta</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    isInvalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                      {fieldErrors.email}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Telefon <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0555 000 0000"
                    isInvalid={!!fieldErrors.phone}
                  />
                  {fieldErrors.phone && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                      {fieldErrors.phone}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Doğum Tarihi</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    isInvalid={!!fieldErrors.date_of_birth}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cinsiyet</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Medeni Durum</Form.Label>
                  <Form.Select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Evli">Evli</option>
                    <option value="Bekar">Bekar</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Contact Information */}
            <h6 className="mb-3 text-secondary">İletişim Bilgileri</h6>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Adres</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Ev adresi giriniz"
                    rows={2}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>İl</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="İl giriniz"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>İlçe</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="İlçe giriniz"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Employment Information */}
            <h6 className="mb-3 text-secondary">İstihdam Bilgileri</h6>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>İşe Başlama Tarihi <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleInputChange}
                    isInvalid={!!fieldErrors.hire_date}
                  />
                  {fieldErrors.hire_date && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                      {fieldErrors.hire_date}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Toplam Deneyim (Yıl)</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_experience"
                    value={formData.total_experience}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.5"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Emergency Contact */}
            <h6 className="mb-3 text-secondary">Acil Durum İletişim</h6>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ad Soyad</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    placeholder="Ad Soyad giriniz"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Telefon</Form.Label>
                  <Form.Control
                    type="tel"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                    placeholder="Telefon giriniz"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>İlişki</Form.Label>
                  <Form.Select
                    name="emergency_contact_relation"
                    value={formData.emergency_contact_relation}
                    onChange={handleInputChange}
                  >
                    <option value="Anne">Anne</option>
                    <option value="Baba">Baba</option>
                    <option value="Eş">Eş</option>
                    <option value="Çocuk">Çocuk</option>
                    <option value="Kardeş">Kardeş</option>
                    <option value="Diğer">Diğer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Roles */}
            <h6 className="mb-3 text-secondary">Roller <span className="text-danger">*</span></h6>
            
            <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              {AVAILABLE_ROLES.map(role => (
                <Form.Check
                  key={role}
                  type="checkbox"
                  id={`role-${role}`}
                  label={role}
                  checked={formData.roles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="mb-2"
                />
              ))}
              {fieldErrors.roles && (
                <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
                  {fieldErrors.roles}
                </div>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              İptal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default EmployeeModal;
