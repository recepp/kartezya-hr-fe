type IProps = {
    headItems: string[]
}

const PrepareTableHead = ({
    headItems
}: IProps) => {
    return (
        <thead className="table-dark">
            <tr>
                {headItems.map((item, index) => {
                    return (
                        <th 
                            key={index} 
                            scope="col" 
                            className="fw-bold text-uppercase fs-6 py-3 px-4 border-0"
                            style={{ 
                                letterSpacing: '0.5px',
                                background: 'linear-gradient(135deg, #495057 0%, #343a40 100%)',
                                color: '#ffffff',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                minWidth: 'fit-content'
                            }}
                        >
                            {item}
                        </th>
                    )
                })}
            </tr>
        </thead>
    );
}

export default PrepareTableHead;