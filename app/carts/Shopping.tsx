'use client'

import {useEffect, useOptimistic, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {CartItem, getCart, updateQuantity} from "@/lib/carts";

export default function ShoppingCart() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [optimisticCart, updateOptimisticCart] = useOptimistic(
        cart,
        (state, {id, change}: { id: string, change: number }) =>
            state.map(item =>
                item.id === id ? {...item, quantity: Math.max(0, item.quantity + change)} : item
            ).filter(item => item.quantity > 0)
    )

    useEffect(() => {
        getCart().then(setCart)
    }, []);

    const handleUpdateQuantity = async (id: string, change: number) => {
        updateOptimisticCart({id, change})
        const updatedCart = await updateQuantity(id, change)
        setCart(updatedCart)
    }

    const total = optimisticCart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
            </CardHeader>
            <CardContent>
                {optimisticCart.map(item => (
                    <div key={item.id} className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                            >
                                -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="justify-between">
                <strong>Total:</strong>
                <span>${total.toFixed(2)}</span>
            </CardFooter>
        </Card>
    )
}