import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import styles from './ProjectCard.module.scss';

interface ProjectMember {
  initials: string;
  name: string;
}

interface ProjectCardProps {
  title: string;
  dueDate?: string;
  completedDate?: string;
  progress: number;
  teamMembers?: ProjectMember[];
  lastUpdated?: string;
  isCompleted?: boolean;
}

export default function ProjectCard({
  title,
  dueDate,
  completedDate,
  progress,
  teamMembers = [],
  lastUpdated,
  isCompleted = false,
}: ProjectCardProps) {
  const displayDate = isCompleted ? completedDate : dueDate;
  const progressVariant = isCompleted ? 'success' : 'primary';

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.cardBody}>
        <div className={styles.header}>
          <h5 className={styles.title}>{title}</h5>
        </div>

        {/* Date Info */}
        {displayDate && (
          <div className={styles.dateInfo}>
            <span className={styles.dateLabel}>{isCompleted ? 'Completed' : 'Due'}:</span>
            <span className={styles.dateValue}>{displayDate}</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <ProgressBar
            now={progress}
            variant={progressVariant}
            className={styles.progressBar}
          />
        </div>

        {/* Team Members & Last Updated */}
        <div className={styles.footer}>
          {teamMembers.length > 0 && (
            <div className={styles.teamMembers}>
              {teamMembers.slice(0, 2).map((member, index) => (
                <div
                  key={index}
                  className={styles.memberAvatar}
                  title={member.name}
                >
                  {member.initials}
                </div>
              ))}
              {teamMembers.length > 2 && (
                <div className={styles.memberMore}>
                  +{teamMembers.length - 2}
                </div>
              )}
            </div>
          )}
          {lastUpdated && (
            <span className={styles.lastUpdated}>Last updated: {lastUpdated}</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
