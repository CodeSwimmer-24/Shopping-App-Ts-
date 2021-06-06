import { useState } from 'react';
import {useQuery} from 'react-query';
import Item from "./Items/Item";
import {Badge, Drawer} from "@material-ui/core";
import { LinearProgress } from '@material-ui/core';
import {Grid} from "@material-ui/core";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Cart from "./Cart";


import {StyledButton, Wrapper} from "./App.styles";

export type CartItemType = {
  id:number;
  category:string;
  description:string;
  image:string;
  price:number;
  title:string;
  amount:number;
}

const getProducts = async (): Promise <CartItemType[]> => 
await (await fetch('https://fakestoreapi.com/products')).json();

function App() {

  const [cartOpen,SetCartOpen] = useState(false);
  const [cartItems,setCartItems] = useState([] as CartItemType[]);

  const {data,isLoading,error} = useQuery<CartItemType[]>(
    'products',
    getProducts
  )
  console.log(data);

  const getTotalItem = (items:CartItemType[]) => 

  items.reduce((ask:number,item) => ask + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };


  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  if(isLoading) return <LinearProgress />;
  if(error) return <div>Something went wrong</div>

  return (
   <Wrapper>
     <Drawer anchor="right" open={cartOpen} onClose={() => SetCartOpen(false) } >
       <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
     </Drawer>
     <StyledButton onClick={() => SetCartOpen(true)}>
       <Badge badgeContent={getTotalItem(cartItems)} color="error">
         <AddShoppingCartIcon />
       </Badge>
     </StyledButton>
     <Grid container spacing={3}>
       {data?.map((item => (
         <Grid item key={item.id} xs={12} sm={4}>
           <Item item={item} handleAddToCart={handleAddToCart} />
         </Grid>
       )))}
     </Grid>
   </Wrapper>
  );
}

export default App;
