import PrepareTableHead from "./PrepareTableHead";
import { Table } from 'react-bootstrap';
import CustomPagination from "./Pagination";
import { Page } from "@/models/common";

type IProps = {
    headItems: string[],
    page?: Page,
    content?: any;
    onHandlePageChange: (page: number) => void
}

const PrepareTable = ({
    headItems,
    page,
    content,
    onHandlePageChange
}: IProps) => {
    console.log('content:', typeof content)
    return (
        <>
            <div style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e9ecef'
            }}>
                <Table 
                    hover 
                    className="mb-0"
                    style={{
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        width: '100%',
                        minWidth: 'max-content'
                    }}
                >
                    <PrepareTableHead headItems={headItems} />
                    <tbody className="table-group-divider">
                        {content}
                    </tbody>
                </Table>
            </div>
            <div className="mt-3">
                <CustomPagination
                    currentPage={page?.page || 1}
                    totalPages={page?.total_pages || 1}
                    totalItems={page?.total}
                    itemsPerPage={page?.limit}
                    onPageChange={onHandlePageChange}
                />
            </div>
        </>
    );
}

export default PrepareTable;