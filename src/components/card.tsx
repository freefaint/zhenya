import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ReadyIcon from '@mui/icons-material/Favorite';
import NotReadyIcon from '@mui/icons-material/FavoriteBorder';
import RemoveIcon from '@mui/icons-material/Remove';

export interface Order {
  date: Date;
  key: React.HTMLProps<HTMLElement>['key'];
  number: number;
  size: number;
  model: string;
  description: string;
  author: string;
  price: number;
  ready?: boolean;
  handleRemove: (item: any) => void;
  handleReady: (item: any) => void;
}

export default function RecipeReviewCard({ key, size, number, model, ready, description, price, author, handleReady, handleRemove }: Order) {
  return (
    <Card key={key} sx={{ maxWidth: 345 }} style={{ margin: "1rem" }}>
      <CardHeader
        title={model}
        subheader={author}
      />
      
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          Цена: {price} руб
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Описание: {description}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Размер: {size}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton onClick={() => handleReady({ number, ready: !ready })}>
          {ready ? <ReadyIcon /> : <NotReadyIcon />}
        </IconButton>

        <IconButton onClick={() => handleRemove({ number })}>
          <RemoveIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
