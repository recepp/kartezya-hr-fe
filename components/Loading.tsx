import { Spinner } from 'react-bootstrap';

const Loading = () => {
    return (
        <div className='d-flex justify-content-center align-items-center h-100'>
            <Spinner
                animation="border"
                variant="primary"
                style={{ width: '2rem', height: '2rem' }}
            />
        </div>
    );
}

export default Loading;