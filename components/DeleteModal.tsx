import { Modal, Button } from 'react-bootstrap';
import LoadingOverlay from './LoadingOverlay';

type IProps = {
    onClose: () => void;
    onHandleDelete: () => void;
    loading?: boolean;
}

export default function DeleteModal({ onClose, onHandleDelete, loading = false }: IProps) {
    return (
        <Modal show={true} onHide={onClose} size="sm">
            <div className="position-relative">
                <LoadingOverlay show={loading} message="Siliniyor..." />
                
                <Modal.Header closeButton>
                    <Modal.Title>Silme Onayı</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Silme işlemini onaylıyor musunuz?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Kapat
                    </Button>
                    <Button variant="danger" onClick={onHandleDelete} disabled={loading}>
                        {loading ? 'Siliniyor...' : 'Sil'}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}