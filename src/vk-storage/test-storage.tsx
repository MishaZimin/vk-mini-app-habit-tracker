import { useAtom } from 'jotai';
import { atomWithVKStorage } from './storage-atom';
// import { atomWithStorage } from 'jotai/utils';

const testAtom = atomWithVKStorage('test_atom', { count: 0 });

export const TestStorage = () => {
  const [data, setData] = useAtom(testAtom);

  return (
    <div>
      <p>Count: {data.count}</p>
      <button onClick={() => setData({ count: data.count + 1 })}>
        Increment
      </button>
    </div>
  );
};
