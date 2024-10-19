'use server'

import {revalidatePath} from 'next/cache'

export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
}

// This would typically be stored in a database
let cart: CartItem[] = [
    {id: '1', name: 'T-Shirt', price: 19.99, quantity: 1},
    {id: '2', name: 'Jeans', price: 49.99, quantity: 1},
]

export async function updateQuantity(id: string, change: number) {
    const item = cart.find(item => item.id === id)
    if (item) {
        item.quantity = Math.max(0, item.quantity + change)
        if (item.quantity === 0) {
            cart = cart.filter(item => item.id !== id)
        }
    }

    revalidatePath('/cart')
    return cart
}

export async function getCart() {
    return cart
}