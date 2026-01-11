import { PaginatedResponse, PaginationParams, BaseService } from '@/services/base.service';
import { useState, useEffect } from 'react';

type IProps<T> = {
    service: BaseService<T>,
    params?: PaginationParams;
}

const initialParameters: PaginationParams = {
    page: 1,
    size: 10,
    sort: 'createdAt',
    direction: 'DESC'
};

const useApi = <T>({ service, params = initialParameters }: IProps<T>) => {
    const [data, setData] = useState<PaginatedResponse<T>>();
    const [isLoading, setIsLoading] = useState(true); // Geri eski haline getir
    const [isError, setIsError] = useState(false);
    const [isRefetch, setIsRefetch] = useState(false);
    const [parameters, setParameters] = useState<PaginationParams>(params);

    const refetch = () => setIsRefetch(!isRefetch)

    const handleSearch = (search: string) => {
        setParameters({
            ...parameters,
            search,
            page: 1 // Reset to first page when searching
        })
    }

    const handlePageChange = (page: number) => {
        setParameters({
            ...parameters,
            page: page
        })
    }

    const handleSort = (sort: string, direction: 'ASC' | 'DESC') => {
        setParameters({
            ...parameters,
            sort,
            direction
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const response = await service.getAll(parameters);
                setData(response)
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [parameters, isRefetch]);

    return [{ data, parameters, isLoading, isError, handleSearch, handlePageChange, handleSort, setParameters, refetch }];
}

export default useApi;
