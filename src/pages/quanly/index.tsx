import { Item } from '@/pages';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
function getCookie(cname: string) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export default function QuanLy() {
  const [status, setStatus] = React.useState('init');
  const [auth, setAuth] = useState(false);
  const [orders, setOrders] = useState<
    {
      _id: string;
      name: string;
      fbUrl: string;
      items?: Item[];
      checked: boolean;
      note?: string;
    }[]
  >([]);
  useEffect(() => {
    (async () => {
      const { data } = await axios('/api/order');
      setOrders(data);
    })();
  }, []);
  useEffect(() => {
    const admin = getCookie('__a');
    if (admin) setAuth(true);
    setStatus('initialed');
  }, []);

  const [checked, setChecked] = useState(false);
  const [state, setState] = useState({
    user: '',
    password: '',
  });
  const [onlyCheck, setOnlyCheck] = useState(false);
  const data = useMemo(() => {
    if (onlyCheck) return orders.filter((f) => f.checked);
    else if (checked) return orders;
    else return orders.filter((f) => !f.checked);
  }, [orders, onlyCheck, checked]);
  const changeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  if (status === 'init') return <>Loading...</>;
  return auth ? (
    <div className='flex flex-col p-2'>
      <h1 className='mb-4 text-2xl font-bold'>Danh sách đơn hàng</h1>
      <div className='flex gap-4'>
        <div className='my-2 flex items-center gap-1'>
          <input
            type='checkbox'
            id='no-check'
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <label htmlFor='no-check'>Hiện tất cả</label>
        </div>
        <div className='my-2 flex items-center gap-1'>
          <input
            type='checkbox'
            id='checked1'
            checked={onlyCheck}
            onChange={(e) => setOnlyCheck(e.target.checked)}
          />
          <label htmlFor='checked1'>Chỉ hiện đơn đã xác nhận</label>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {data.map((v) => {
          return (
            <div
              className='relative flex flex-col items-start rounded-md border border-gray-100 p-2 shadow-md'
              key={v._id}
            >
              {v.checked && (
                <div className='absolute right-2 top-2 flex h-12 w-12 -rotate-12 items-center justify-center rounded-full border border-red-500'>
                  <p className='border-y border-red-500 px-2 text-xs font-bold text-red-400'>
                    OK
                  </p>
                </div>
              )}
              <p className='font-semibold'>Tên: {v.name}</p>
              <Link
                className='text-blue-400 underline hover:text-blue-600'
                href={v.fbUrl}
                target='_blank'
              >
                FB: {v.fbUrl}
              </Link>
              <p className='w-full text-end'>
                <Link
                  className='underline hover:text-blue-600'
                  href={'/quanly/' + v._id}
                >
                  Chi tiết
                </Link>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className='flex min-h-[60vh] flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <h1 className='mb-4 text-2xl font-bold'>Đăng nhập</h1>
        <div className='flex flex-col'>
          <label htmlFor='user'>Tên</label>
          <input
            className='w-[200px] rounded border-gray-300 p-1 px-2 text-cyan-800 placeholder:text-gray-300'
            type='text'
            name='user'
            id='user'
            onChange={changeState}
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor='pass'>Mật khẩu</label>
          <input
            className='w-[200px] rounded border-gray-300 p-1 px-2 text-cyan-800 placeholder:text-gray-300'
            type='password'
            id='pass'
            name='password'
            onChange={changeState}
          />
        </div>
        <div className='flex justify-center'>
          <button
            className='border-primary-700 mt-2 rounded border px-4 py-1 shadow disabled:border-gray-50 disabled:bg-slate-100 disabled:text-gray-300'
            disabled={!state.password || !state.user}
            onClick={() => {
              if (state.user === 'nam-food' && state.password === 'nam-food') {
                setCookie('__a', 'true', 365);
                window.location.reload();
              }
            }}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
