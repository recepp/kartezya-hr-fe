"use client";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useMounted from "@/hooks/useMounted";
import { authService, LoginRequest } from "@/services/auth.service";
import FormTextField from "@/components/FormTextField";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const hasMounted = useMounted();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return "E-posta adresi zorunludur";
        if (!/\S+@\S+\.\S+/.test(value)) return "Geçerli bir e-posta adresi giriniz";
        break;
      case 'password':
        if (!value) return "Şifre zorunludur";
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
  };

  const handleInputBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const request: LoginRequest = {
        email: formData.email,
        password: formData.password
      };

      const response = await authService.login(request);

      if (response.success) {
        router.replace('/');
      }
    } catch (err: any) {
      toast.error(err.message || "Giriş yapılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = !errors.email && !errors.password && formData.email && formData.password;

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="d-flex justify-content-center align-items-center mb-6">
              <p className="h3 fw-bold">Kartezya HR</p>
            </div>

            {hasMounted && (
              <Form noValidate onSubmit={handleSubmit}>
                <FormTextField
                  as={Col}
                  md={12}
                  controlId="validationEmail"
                  label="E-posta"
                  type="email"
                  name="email"
                  placeholder="E-posta adresinizi giriniz"
                  value={formData.email}
                  onChange={(name, value) => handleInputChange(name, value)}
                  onBlur={(name) => handleInputBlur(name)}
                  error={touched.email ? errors.email : undefined}
                  required
                />
                
                <FormTextField
                  as={Col}
                  md={12}
                  controlId="validationPassword"
                  label="Şifre"
                  type="password"
                  name="password"
                  placeholder="Şifrenizi giriniz"
                  value={formData.password}
                  onChange={(name, value) => handleInputChange(name, value)}
                  onBlur={(name) => handleInputBlur(name)}
                  error={touched.password ? errors.password : undefined}
                  required
                />

                <div className="d-grid mt-4">
                  <Button
                    disabled={!isFormValid || isLoading}
                    variant="primary"
                    type="submit"
                  >
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
