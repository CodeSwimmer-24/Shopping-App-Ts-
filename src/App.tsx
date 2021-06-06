import { useState } from 'react';
import {useQuery} from 'react-query';
import Item from "./Items/Item";
import {Badge, Drawer} from "@material-ui/core";
import { LinearProgress } from '@material-ui/core';
import {Grid} from "@material-ui/core";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';



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

  const getTotalItem = (items:CartItemType[]) => null;

  const handleAddToCart = (clickedItem: CartItemType) => null; 

  const handleRemoveFromCart = () => null;

  if(isLoading) return <LinearProgress />;
  if(error) return <div>Something went wrong</div>

  return (
   <Wrapper>
     <Drawer anchor="right" open={cartOpen} onClose={() => SetCartOpen(false) } >Cart Button</Drawer>
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
