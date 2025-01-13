import { api, apiErrorHandler } from "@/lib/api";
import { ReturnValue, ReturnValueWithPagination } from "@/types";
import { Product, ProductCategory } from "@/types/products";
import { AxiosRequestConfig } from "axios";

export async function getProducts(config?: AxiosRequestConfig) {
    try {
        const { data } = await api.get<ReturnValueWithPagination<Product>>('/products-service/products', config)

        return data
    } catch (err) {
        return apiErrorHandler<ReturnValue<null>>(err)
    }
}

export async function getProductBySlug(slug: string, config?: AxiosRequestConfig) {
    try {
        const { data } = await api.get<ReturnValue<Product>>(`/products-service/product/${slug}`, config)

        return data
    } catch (err) {
        return apiErrorHandler<ReturnValue<null>>(err)
    }
}

export async function getCategories(config?: AxiosRequestConfig) {
    try {
        const { data } = await api.get<ReturnValueWithPagination<ProductCategory>>('/products-service/categories', config)

        return data
    } catch (err) {
        return apiErrorHandler<ReturnValue<null>>(err)
    }
}