'use client'

import { getCart as get, addToCart as add, clearCart as clear, deleteCart as remove, updateCart as update } from "@/app/actions/cart"
import { ReturnValue } from "@/types"
import { Cart } from "@/types/cart"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

interface Props{
    children: React.ReactNode
}

interface CartContext{
    cart: Cart[] | null,
    removeFromCart: (id: string)=> Promise<ReturnValue<Cart | null>>,
    addToCart: (productId:string)=>Promise<ReturnValue<Cart | null>>,
    updateCart: (params: {id:string, productId:string, quantity:number})=>Promise<ReturnValue<Cart | null>>,
    clearCart:()=>Promise<ReturnValue<{count: number} | null>>,
    isFetching: boolean,
    isLoading: boolean,
    isError: boolean,
    error?: any,
    cartOpen: boolean,
    toggleCart: (value: boolean)=>void
}

const CartContext = createContext<CartContext|null>(null)

export function CartProvider({children}:Props){
    const session = useSession()
    const [cartOpen, setCartOpen] = useState(false)
    const pathname = usePathname()

    const qc = useQueryClient()

    


    const userId = session?.data?.user?.id;

    const {data, error, isError,  isLoading, isFetching} = useQuery({
        queryKey: ['cart'],
        queryFn: () => get({
            headers:{
                Authorization: `Bearer ${session.data?.accessToken?.token}`
            }
        }),
        enabled: !!session.data?.accessToken?.token
    })

    async function addToCart(productId:string):Promise<ReturnValue<Cart|null>>{

        const data = await add(
            {
                productId,
                userId,
                quantity: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${session?.data?.accessToken?.token}`
                }
            }
        )
        
        qc.invalidateQueries({queryKey: ['cart']})

        toggleCart(true)

        return data
    }

    async function updateCart({id, productId, quantity}:{id:string, productId:string, quantity:number}){
        // update cart
        let data:ReturnValue<Cart | null> = {data: null, success: false, message: 'Unexpected error', error: {message: 'Unexpected error'}}
        if (quantity < 1) {
            data =  await remove(id, {
                headers: {
                    Authorization: `Bearer ${session.data?.accessToken?.token}`
                }
            })
        }else{
            data = await update({quantity, productId}, {
                headers: {
                    Authorization: `Bearer ${session.data?.accessToken?.token}`
                }
            })
        }

        qc.invalidateQueries({
            queryKey: ['cart']
        })

        return data

        
    }

    async function clearCart(){
        const res =  (await clear({
            headers:{
                Authorization: `Bearer ${session.data?.accessToken?.token}`
            }
        }))

        qc.invalidateQueries({
            queryKey: ['cart'],

        })

        return res
    }

    async function removeFromCart(id:string){
        const res =  (await remove(id, {
            headers:{
                Authorization: `Bearer ${session.data?.accessToken?.token}`
            }
        }))

        qc.invalidateQueries({
            queryKey: ['cart']
        })

        return res
    }

    const toggleCart = useCallback((value: boolean)=>{
        setCartOpen(value || !cartOpen)
    }, [cartOpen])



    const contextValue = useMemo(
        () => ({
            cart: data?.data?.data || null,
            removeFromCart,
            addToCart,
            updateCart,
            clearCart,
            isFetching,
            isLoading,
            isError: isError || !data?.success,
            error: error || data?.error,
            cartOpen,
            toggleCart
        }),
        [data, isFetching, isLoading, isError, error, cartOpen, session]
    );

    useEffect(()=>{
        cartOpen && toggleCart(false)

    }, [pathname])

    return(
        
        <CartContext.Provider value={{...contextValue}}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart(){
    const context = useContext<CartContext|null>(CartContext)
    if(!context){
        throw new Error('useCart must be used within a CartProvider')
    }

    return context
}