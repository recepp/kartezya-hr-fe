"use client";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import useMounted from "@/hooks/useMounted";
import { useAuth } from "@/hooks/useAuth";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "@/components/FormTextField";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface FormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const hasMounted = useMounted();
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Get callback URL from search params
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  // Check if user is already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hr_auth_token');
      if (token) {
        router.replace(callbackUrl);
      }
    }
  }, [callbackUrl, router]);

  const initialValues: FormData = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("E-posta adresi zorunludur")
      .email("Geçersiz E-posta adresi"),
    password: Yup.string().required("Şifre zorunludur"),
  });

  const handleSubmit = async (values: FormData) => {
    const { email, password } = values;
    console.log('Login attempt started with:', { email, password: '***' });
    try {
      setError(null);
      const response = await login({ email, password });
      console.log('Login response:', response);
      if (response.success) {
        console.log('Login successful, redirecting to:', callbackUrl);
        // Redirect to callback URL or home page
        router.replace(callbackUrl);
      }
    } catch (err: any) {
      console.error('Login error caught:', err);
      console.error('Error message:', err.message);
      console.error('Original error:', err.originalError);
      setError(err.message || "Giriş yapılırken bir hata oluştu");
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="d-flex justify-content-center align-items-center mb-6">
              <p className="h3 fw-bold">Kartezya HR - Giriş Yap</p>
            </div>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            {hasMounted && (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, isValid, isSubmitting }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <FormTextField
                      as={Col}
                      md={12}
                      controlId="validationEmail"
                      label="E-posta Adresi"
                      type="text"
                      name="email"
                    />
                    <FormTextField
                      as={Col}
                      md={12}
                      controlId="validationPassword"
                      label="Şifreniz"
                      type="password"
                      name="password"
                    />
                    <div className="d-grid">
                      <Button
                        disabled={!isValid || isSubmitting || isLoading}
                        variant="primary"
                        as="input"
                        size="lg"
                        type="submit"
                        value={isSubmitting || isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
