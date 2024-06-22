'use client';

import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import Link from 'next/link';
import PrimaryLink from '@/components/links/PrimaryLink';
import NextImage from '@/components/NextImage';
import Button from '@/components/buttons/Button';
import { FaShoppingCart } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import Cart from '@/components/Cart';
import { IoMdRemoveCircle } from 'react-icons/io';

export interface Item {
  id: number;
  img: string;
  name: string;
  price: number;
  quantity: number;
}
const menus: Omit<Item, 'quantity'>[] = [
  {
    id: 1,
    img: 'xoithapcam.png',
    name: 'Xôi thập cẩm',
    price: 700,
  },
  {
    id: 2,
    img: 'bunthitnuong.png',
    name: 'Bún thịt nướng',
    price: 700,
  },
  {
    id: 3,
    img: 'chethapcam.png',
    name: 'Chè thập cẩm',
    price: 400,
  },
  {
    id: 4,
    img: 'cheduadam.png',
    name: 'Chè dừa dầm',
    price: 450,
  },
  {
    id: 5,
    img: 'chesau.png',
    name: 'Chè sầu',
    price: 450,
  },
  {
    id: 6,
    img: 'chebuoigion.png',
    name: 'Chè bưởi giòn',
    price: 400,
  },
];
export default function HomePage() {
  const [status, setStatus] = React.useState('init');
  const [items, setItems] = React.useState<Item[]>([]);
  React.useEffect(() => {
    const tmp = localStorage.getItem('items');
    if (tmp) {
      setItems(JSON.parse(tmp));
    }
    setStatus('initialed');
  }, []);
  React.useEffect(() => {
    if (status !== 'init') localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo templateTitle='Menu' />
      <main className='flex min-h-screen flex-col items-center gap-2 bg-[#EBDECD] pb-20'>
        <h1 className='mt-4 text-3xl font-bold'>Nấm Food</h1>
        <Link
          className='text-blue-400 underline hover:text-blue-600'
          href={'https://www.facebook.com/tatnguon001'}
        >
          FB Phạm Ngọc Ánh
        </Link>
        <div className='flex justify-center'>
          <p className='text-xl font-bold'>- Menu -</p>
        </div>
        <div className='flex flex-wrap justify-evenly gap-4'>
          {menus.map((v) => {
            const exists = items.find((f) => f.id === v.id);
            return (
              <div key={v.id} className='flex flex-col items-center'>
                <NextImage
                  useSkeleton
                  className='w-40 rounded-full border-2 border-white shadow-md'
                  src={'/images/' + v.img}
                  width='180'
                  height='180'
                  alt='Icon'
                />
                <div className='mt-2 text-center font-semibold'>
                  <p>{v.name}</p>
                  <p>{v.price}¥</p>
                </div>
                <Button
                  size='sm'
                  variant={exists ? 'secondary' : 'outline'}
                  rightIcon={exists ? IoMdRemoveCircle : FaShoppingCart}
                  onClick={() => {
                    if (!exists) {
                      setItems((pre) => [
                        ...pre,
                        {
                          ...v,
                          quantity: 1,
                        },
                      ]);
                    } else {
                      setItems(items.filter((f) => f.id !== v.id));
                    }
                  }}
                >
                  {exists ? 'Đã chọn' : 'Thêm vào giỏ hàng'}
                </Button>
              </div>
            );
          })}
        </div>
        <Cart items={items} setItems={setItems} />
      </main>
    </Layout>
  );
}
