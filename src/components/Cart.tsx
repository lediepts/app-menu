import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import { Item } from '@/pages';
import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface Props {
  items: Item[];
  setItems: (items: Item[]) => void;
}
export default function Cart({ items, setItems }: Props) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    name: '',
    fbUrl: '',
  });
  const changeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  const changeQuantity = (id: number, i: number) => {
    const index = items.findIndex((f) => f.id === id);
    if (index < 0) return;
    const item = items[index];
    if (item.quantity === 1 && i < 0) return;
    const tmp = [...items];
    tmp.splice(index, 1, { ...item, quantity: item.quantity + i });
    setItems(tmp);
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-white/70 shadow'>
      {step === 0 && (
        <div className='flex items-center justify-between p-2'>
          <p>Có {items.length} sản phẩm đang được chọn</p>
          <Button
            size='sm'
            disabled={items.length <= 0}
            rightIcon={FaArrowRightLong}
            onClick={() => setStep(1)}
          >
            Xác nhận
          </Button>
        </div>
      )}
      {step === 1 && (
        <div>
          <div className='min-h-screen bg-gray-400/20'></div>
          <div className='flex min-h-[500px] flex-col gap-2 bg-white p-2'>
            <div className='flex justify-between'>
              <p className='flex-1 text-center text-lg font-bold'>
                Danh sách đã chọn
              </p>
              <button className='text-xl' onClick={() => setStep(0)}>
                <IoClose />
              </button>
            </div>
            <div>
              <div className='flex border-b bg-gray-100 py-1 font-bold'>
                <p className='w-8'></p>
                <p className='flex-1'>Tên</p>
                <p className='w-24'>Số lượng</p>
                <p className='w-14'>Giá</p>
              </div>

              {items.map((v) => {
                return (
                  <div
                    className='my-1 flex items-center border-b py-1'
                    key={v.id}
                  >
                    <div className='w-8'>
                      <button
                        className='text-2xl text-red-600'
                        onClick={() => {
                          setItems(items.filter((f) => f.id !== v.id));
                        }}
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                    <p className='flex-1'>{v.name}</p>
                    <div className='flex w-24 items-center gap-1'>
                      <button
                        disabled={v.quantity === 1}
                        className={cn('text-2xl disabled:text-gray-200')}
                        onClick={() => changeQuantity(v.id, -1)}
                      >
                        <CiCircleMinus />
                      </button>
                      <p className='w-6 border bg-gray-50 text-center '>
                        {v.quantity}
                      </p>
                      <button
                        className='text-2xl'
                        onClick={() => changeQuantity(v.id, 1)}
                      >
                        <CiCirclePlus />
                      </button>
                    </div>
                    <p className='w-14'>{v.price}¥</p>
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
            <hr />
            <div className='flex justify-center'>
              <Button
                size='base'
                disabled={items.length <= 0}
                rightIcon={FaArrowRightLong}
                onClick={() => setStep(2)}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <div className='min-h-screen bg-gray-400/20'></div>
          <div className='flex min-h-[500px] flex-col gap-2 bg-white p-2'>
            <div className='flex justify-between'>
              <p className='flex-1 text-center text-lg font-bold'>
                Thông tin khách hàng
              </p>
              <button className='text-xl' onClick={() => setStep(0)}>
                <IoClose />
              </button>
            </div>
            <hr />
            <p className='mb-4 font-semibold italic'>
              Bạn vui lòng cung cấp tên và địa chỉ facebook để chúng tôi có thể
              liên hệ để xác nhận đơn đặt hàng của bạn. Trân trọng!
            </p>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col'>
                <label htmlFor='name'>Tên đầy đủ</label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='rounded border-gray-300 p-1 px-2 text-cyan-800 placeholder:text-gray-300'
                  placeholder='Nguyen Van A'
                  onChange={changeState}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='fbUrl'>Link facebook</label>
                <input
                  className='rounded border-gray-300 p-1 px-2 text-cyan-800 placeholder:text-gray-300'
                  type='text'
                  name='fbUrl'
                  id='fbUrl'
                  placeholder='https://www.facebook.com/tatnguon001'
                  onChange={changeState}
                />
              </div>
            </div>
            <hr />
            <div className='flex justify-center gap-4'>
              <Button
                size='base'
                isLoading={loading}
                leftIcon={FaArrowLeftLong}
                onClick={async () => {
                  setStep(1);
                }}
              >
                Quay lại
              </Button>
              <Button
                size='base'
                isLoading={loading}
                disabled={!state.fbUrl || !state.name}
                rightIcon={FaArrowRightLong}
                onClick={async () => {
                  if (state.fbUrl && state.name) {
                    try {
                      setLoading(true);
                      await axios.post('/api/order', {
                        ...state,
                        items,
                      });
                      setItems([]);
                      localStorage.removeItem('items');
                      setStep(3);
                    } catch (error) {
                      alert(
                        'Hệ thống đặt hàng hiện đang sảy ra lỗi, vui lòng thử lại sau hoặc liên hệ với quản trị viên( Thông tin liên hệ tại trang chủ)'
                      );
                    }
                    setLoading(false);
                  }
                }}
              >
                Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div className='min-h-screen bg-gray-400/20'></div>
          <div className='flex min-h-[500px] flex-col gap-2 bg-white p-2'>
            <div className='flex justify-between'>
              <p className='flex-1 text-center text-lg font-bold'>
                Thông tin khách hàng
              </p>
              <button className='text-xl' onClick={() => setStep(0)}>
                <IoClose />
              </button>
            </div>
            <hr />
            <p className='mb-4 font-semibold italic'>
              Đơn hàng của bạn được đặt thành công.
              <br />
              Bộ phận xác nhận của chúng tôi sẽ liên hệ với bạn sớm nhất để hoàn
              tất, xin cảm ơn sự ủng hộ của bạn!
            </p>

            <hr />
            <div className='flex justify-center'>
              <Button
                size='base'
                onClick={async () => {
                  setStep(0);
                }}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
