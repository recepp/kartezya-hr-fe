"use client";
import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import FormTextField from '@/components/FormTextField';
import { authService, ChangePasswordRequest } from '@/services/auth.service';
import useMounted from '@/hooks/useMounted';
import LoadingOverlay from '@/components/LoadingOverlay';
import { toast } from 'react-toastify';

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePasswordModal = ({ show, onHide }: ChangePasswordModalProps) => {
  const hasMounted = useMounted();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'currentPassword':
        if (!value) return "Mevcut şifre zorunludur";
        break;
      case 'newPassword':
        if (!value) return "Yeni şifre zorunludur";
        if (value.length < 6) return "Şifre en az 6 karakter olmalıdır";
        if (value === formData.currentPassword) return "Yeni şifre mevcut şifre ile aynı olamaz";
        break;
      case 'confirmPassword':
        if (!value) return "Şifre doğrulama zorunludur";
        if (value !== formData.newPassword) return "Şifreler eşleşmiyor";
        break;
    }
    return undefined;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Also revalidate related fields
    if (name === 'currentPassword' && touched.newPassword) {
      const newPasswordError = validateField('newPassword', formData.newPassword);
      setErrors(prev => ({ ...prev, newPassword: newPasswordError }));
    }
    if (name === 'newPassword' && touched.confirmPassword) {
      const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
    }
  };

  const handleInputBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.currentPassword = validateField('currentPassword', formData.currentPassword);
    newErrors.newPassword = validateField('newPassword', formData.newPassword);
    newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    
    setErrors(newErrors);
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
    
    return !newErrors.currentPassword && !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const request: ChangePasswordRequest = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      };

      const response = await authService.changePassword(request);

      if (response.success) {
        toast.success('Şifreniz başarıyla değiştirilmiştir.');
        resetForm();
        onHide();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Şifre değiştirme sırasında bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setTouched({});
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const isFormValid = !errors.currentPassword && !errors.newPassword && !errors.confirmPassword && 
                     formData.currentPassword && formData.newPassword && formData.confirmPassword;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <div className="position-relative">
        <LoadingOverlay show={isLoading} message="Şifre değiştiriliyor..." />
        
        <Modal.Header closeButton>
          <Modal.Title>Şifre Değişikliği</Modal.Title>
        </Modal.Header>

        {hasMounted && (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body>
              <FormTextField
                controlId="validationCurrentPassword"
                label="Mevcut Şifre"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={touched.currentPassword ? errors.currentPassword : undefined}
                disabled={isLoading}
              />

              <FormTextField
                controlId="validationNewPassword"
                label="Yeni Şifre"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={touched.newPassword ? errors.newPassword : undefined}
                disabled={isLoading}
              />

              <FormTextField
                controlId="validationConfirmPassword"
                label="Şifre Doğrulama"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                disabled={isLoading}
              />
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? 'İşleniyor...' : 'Şifre Değiştir'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
