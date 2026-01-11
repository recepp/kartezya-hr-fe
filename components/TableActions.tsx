import React from 'react';
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Edit3, Trash2, Eye, MoreVertical, Download, Copy } from 'react-feather';

interface ActionButtonProps {
  variant?: string;
  size?: 'sm' | 'lg';
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  variant = 'outline-primary', 
  size = 'sm', 
  onClick, 
  icon, 
  tooltip,
  disabled = false 
}) => (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip id={`tooltip-${tooltip}`}>{tooltip}</Tooltip>}
  >
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className="d-inline-flex align-items-center justify-content-center"
      style={{
        width: '35px',
        height: '35px',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #dee2e6'
      }}
    >
      {icon}
    </Button>
  </OverlayTrigger>
);

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  viewDisabled?: boolean;
  downloadDisabled?: boolean;
  copyDisabled?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  showDownload?: boolean;
  showCopy?: boolean;
  showMore?: boolean;
  customActions?: Array<{
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    variant?: string;
    disabled?: boolean;
  }>;
}

const TableActions: React.FC<TableActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  onDownload,
  onCopy,
  editDisabled = false,
  deleteDisabled = false,
  viewDisabled = false,
  downloadDisabled = false,
  copyDisabled = false,
  showEdit = true,
  showDelete = true,
  showView = false,
  showDownload = false,
  showCopy = false,
  showMore = false,
  customActions = []
}) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <ButtonGroup size="sm" className="shadow-sm">
        {showView && onView && (
          <ActionButton
            variant="outline-info"
            icon={<Eye size={16} />}
            tooltip="Görüntüle"
            onClick={onView}
            disabled={viewDisabled}
          />
        )}
        
        {showEdit && onEdit && (
          <ActionButton
            variant="outline-primary"
            icon={<Edit3 size={16} />}
            tooltip="Düzenle"
            onClick={onEdit}
            disabled={editDisabled}
          />
        )}
        
        {showCopy && onCopy && (
          <ActionButton
            variant="outline-secondary"
            icon={<Copy size={16} />}
            tooltip="Kopyala"
            onClick={onCopy}
            disabled={copyDisabled}
          />
        )}
        
        {showDownload && onDownload && (
          <ActionButton
            variant="outline-success"
            icon={<Download size={16} />}
            tooltip="İndir"
            onClick={onDownload}
            disabled={downloadDisabled}
          />
        )}
        
        {showDelete && onDelete && (
          <ActionButton
            variant="outline-danger"
            icon={<Trash2 size={16} />}
            tooltip="Sil"
            onClick={onDelete}
            disabled={deleteDisabled}
          />
        )}
        
        {customActions.map((action, index) => (
          <ActionButton
            key={index}
            variant={action.variant || "outline-secondary"}
            icon={action.icon}
            tooltip={action.tooltip}
            onClick={action.onClick}
            disabled={action.disabled || false}
          />
        ))}
        
        {showMore && (
          <ActionButton
            variant="outline-secondary"
            icon={<MoreVertical size={16} />}
            tooltip="Diğer İşlemler"
            onClick={() => {}}
          />
        )}
      </ButtonGroup>
    </div>
  );
};

export default TableActions;