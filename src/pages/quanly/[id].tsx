import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Item } from '@/pages';
import Link from 'next/link';
import { MdDeleteOutline } from 'react-icons/md';
import axios from 'axios';

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: order,
    error,
    isLoading,
  } = useSWR<{
    _id: string;
    name: string;
    fbUrl: string;
    items?: Item[];
    checked: boolean;
    note?: string;
  }>(id ? `/api/order/${id}` : null, fetcher);

  if (error) return <p>Failed to load</p>;
  if (isLoading) return <p>Loading...</p>;
  if (!order) return null;
  const items = order.items || [];
  return (
    <div className='mt-2'>
      <p className='text-center font-bold underline'>
        <Link href={'/quanly'}>Quay lại</Link>
      </p>
      <div className='flex flex-col p-2'>
        <h1 className='mb-4 text-2xl font-bold'>Chi tiết đơn hàng</h1>
        <p>Tên: {order.name}</p>
        <p className='flex gap-2'>
          <span>FB:</span>
          <Link
            className='text-blue-400 underline hover:text-blue-600'
            href={order.fbUrl}
            target='_blank'
          >
            {order.fbUrl}
          </Link>
        </p>
        <p>Đơn hàng</p>
        <div>
          <div className='flex bg-gray-100 px-1 py-2 font-bold'>
            <p className='flex-1'>Tên</p>
            <p className='w-24'>Số lượng</p>
            <p className='w-12'>Giá</p>
          </div>

          {items.map((v) => {
            return (
              <div className='my-1 flex items-center border-b p-1' key={v.id}>
                <p className='flex-1'>{v.name}</p>
                <div className='flex w-24 items-center gap-2'>
                  <p className='text-center'>{v.quantity}</p>
                </div>
                <p className='w-12'>{v.price}¥</p>
              </div>
            );
          })}
          <div className='flex gap-2'>
            <p className='flex-1 text-end'>Tổng</p>
            <p className='w-max'>
              {items.reduce((p, c) => {
                return p + c.price * c.quantity;
              }, 0)}
              ¥
            </p>
          </div>
        </div>
        <div className='flex justify-center'>
          {!order.checked ? (
            <div className='flex flex-col gap-8'>
              <button
                className='border-primary-600 rounded-md border px-4 py-1'
                onClick={async () => {
                  await axios.put('/api/order/' + id, {
                    checked: true,
                  });
                  location.reload();
                }}
              >
                Xác nhận hoàn tất
              </button>
              <button
                className='rounded-md border bg-red-600 px-4 py-1 text-white'
                onClick={async () => {
                  const c = confirm('Bạn chắc chắn muốn xóa đơn này?');
                  if (c) {
                    await axios.delete('/api/order/' + id);
                    router.push('/quanly');
                  }
                }}
              >
                Xóa đơn
              </button>
            </div>
          ) : (
            <div className='flex h-32 w-32 items-center justify-center rounded-full border border-red-500'>
              <p className='border-y border-red-500 px-2 font-bold text-red-400'>
                Đã Xác nhận
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
