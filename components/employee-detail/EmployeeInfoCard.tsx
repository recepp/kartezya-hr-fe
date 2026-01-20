import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './EmployeeInfoCard.module.scss';

interface InfoField {
  label: string;
  value: string;
  isHighlight?: boolean;
}

interface EmployeeInfoCardProps {
  title: string;
  fields: InfoField[];
}

export default function EmployeeInfoCard({ title, fields }: EmployeeInfoCardProps) {
  return (
    <Card className={styles.card}>
      <Card.Body className={styles.cardBody}>
        <h5 className={styles.title}>{title}</h5>
        <div className={styles.fieldsContainer}>
          {fields.map((field, index) => (
            <div key={index} className={styles.field}>
              <div className={styles.label}>{field.label}</div>
              <div className={`${styles.value} ${field.isHighlight ? styles.highlight : ''}`}>
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
