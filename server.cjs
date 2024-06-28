const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Hotel routes
app.get('/hotels', async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/hotels/:id', async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { floors: true, rooms: true, products: true },
    });
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/hotels/:id/floors', async (req, res) => {
  try {
    const floors = await prisma.floor.findMany({
      where: { hotelId: parseInt(req.params.id) },
      include: { rooms: true },

    });
    res.json(floors);
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/hotels', async (req, res) => {
  const { name } = req.body;
  try {
    const newHotel = await prisma.hotel.create({
      data: { name },
    });
    res.status(201).json(newHotel);
  } catch (error) {
    console.error('Error adding hotel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/hotels/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const updatedHotel = await prisma.hotel.update({
      where: { id: parseInt(req.params.id) },
      data: { name },
    });
    res.json(updatedHotel);
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/hotels/:id', async (req, res) => {
  try {
    await prisma.hotel.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Floor routes
app.post('/floors', async (req, res) => {
  const { floorNumber, hotelId } = req.body;

  try {
    const newFloor = await prisma.floor.create({
      data: {
        floorNumber,
        hotelId,
      },
    });
    res.status(201).json(newFloor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/floors', async (req, res) => {
  try {
    const floors = await prisma.floor.findMany({
      orderBy: {
        floorNumber: 'desc',
      },
    });
    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/floors/:id', async (req, res) => {
  try {
    const floor = await prisma.floor.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { rooms: true },
    });
    if (floor) {
      res.json(floor);
    } else {
      res.status(404).json({ error: 'Floor not found' });
    }
  } catch (error) {
    console.error('Error fetching floor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/floors/:id', async (req, res) => {
  const { floorNumber } = req.body;
  try {
    const updatedFloor = await prisma.floor.update({
      where: { id: parseInt(req.params.id) },
      data: { floorNumber },
    });
    res.json(updatedFloor);
  } catch (error) {
    console.error('Error updating floor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/floors/:id', async (req, res) => {
  try {
    await prisma.floor.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting floor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Room routes
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        roomNumber: 'asc',
      },
    });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/rooms/:hotelId', async (req, res) => {
  const { hotelId } = req.params;
  
  try {
    const rooms = await prisma.room.findMany({
      where: {
        hotelId: parseInt(hotelId),
      },
      orderBy: {
        roomNumber: 'asc',
      },
    });
    res.json(rooms);
  } catch (error) {
    console.error(`Error fetching rooms for hotelId ${hotelId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/rooms', async (req, res) => {
  const { roomNumber, hotelId, floorId, locked, state } = req.body;
  try {
    const newRoom = await prisma.room.create({
      data: { roomNumber, hotelId, floorId, locked, state },
    });
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/rooms/:id', async (req, res) => {
  const { roomNumber, locked, state } = req.body;
  try {
    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(req.params.id) },
      data: { roomNumber, locked, state },
    });
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/rooms/:id', async (req, res) => {
  try {
    await prisma.room.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Product routes
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/hotels/:hotelId/products', async (req, res) => {
  const hotelId = parseInt(req.params.hotelId);

  try {
    const products = await prisma.product.findMany({
      where: { hotelId },
      include: { hotel: true }, // Include the associated hotel data
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/products', async (req, res) => {
  const { name, price, hotelId } = req.body;

  try {
    const newProductData = { name, price };
    if (hotelId) {
      newProductData.hotel = { connect: { id: hotelId } };
    }

    const newProduct = await prisma.product.create({
      data: newProductData,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/hotels/:id/products', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: { products: true },
    });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(hotel.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/products/:id', async (req, res) => {
  const { name, price } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, price },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// RoomStock routes
app.get('/roomstocks/:roomId', async (req, res) => {
  try {
    const roomStock = await prisma.roomStock.findMany({
      where: { roomId: parseInt(req.params.roomId) },
      include: { product: true },
    });
    res.json(roomStock);
  } catch (error) {
    console.error('Error fetching room stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/roomstocks/:roomId/:productId', async (req, res) => {
  const { quantity } = req.body;
  try {
    const updatedRoomStock = await prisma.roomStock.upsert({
      where: {
        roomId_productId: {
          roomId: parseInt(req.params.roomId),
          productId: parseInt(req.params.productId),
        },
      },
      update: { quantity },
      create: {
        roomId: parseInt(req.params.roomId),
        productId: parseInt(req.params.productId),
        quantity,
      },
    });
    res.json(updatedRoomStock);
  } catch (error) {
    console.error('Error updating room stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Invoice routes
app.get('/invoices', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
    });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: true },
    });
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/invoices', async (req, res) => {
  const { roomId, total, items } = req.body;
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        roomId,
        total,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/invoices/:id', async (req, res) => {
  const { total } = req.body;
  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: parseInt(req.params.id) },
      data: { total },
      include: { items: true },
    });
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/invoices/:id', async (req, res) => {
  try {
    await prisma.invoice.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// InvoiceItem routes
app.post('/invoices/:invoiceId/items', async (req, res) => {
  const { productId, quantity, price } = req.body;
  try {
    const newInvoiceItem = await prisma.invoiceItem.create({
      data: {
        invoiceId: parseInt(req.params.invoiceId),
        productId,
        quantity,
        price,
      },
    });
    res.status(201).json(newInvoiceItem);
  } catch (error) {
    console.error('Error adding invoice item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/invoices/:invoiceId/items/:itemId', async (req, res) => {
  const { quantity, price } = req.body;
  try {
    const updatedInvoiceItem = await prisma.invoiceItem.update({
      where: { id: parseInt(req.params.itemId) },
      data: { quantity, price },
    });
    res.json(updatedInvoiceItem);
  } catch (error) {
    console.error('Error updating invoice item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/invoices/:invoiceId/items/:itemId', async (req, res) => {
  try {
    await prisma.invoiceItem.delete({
      where: { id: parseInt(req.params.itemId) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting invoice item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});