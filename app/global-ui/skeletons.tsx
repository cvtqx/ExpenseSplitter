
export const SkeletonLoader = ({
  width = '100%',
  height = '100px',
  borderRadius = '5px',
}) => {
  return (
    <div
      className='relative overflow-hidden bg-gray-200 animate-pulse mb-2'
      style={{ width, height, borderRadius }}></div>
  );
};

export function FriendSkeletons() {
  return (
    <div className='p-4'>
      <div className='mt-8 mb-4'>
        <SkeletonLoader
          width='10rem'
          height='1.8rem'
        />
      </div>
      <div>
        <SkeletonLoader
          width='10rem'
          height='1.5rem'
        />
      </div>
      <div className='mt-8'>
        <SkeletonLoader height='4rem' />
        <SkeletonLoader height='4rem' />
        <SkeletonLoader height='4rem' />
      </div>
    </div>
  );
}

export function GroupSkeletons() {
  return (
    <div className='p-4'>
      <div className='mt-8 mb-4'>
        <SkeletonLoader
          width='10rem'
          height='1.8rem'
        />
      </div>
      <div>
        <SkeletonLoader
          width='10rem'
          height='1.5rem'
        />
      </div>
      <div className='mt-8'>
        <SkeletonLoader height='4rem' />
        <SkeletonLoader height='4rem' />
        <SkeletonLoader height='4rem' />
      </div>
    </div>
  );
}

export function ExpenseSkeletons() {
  return (
    <div className='p-4'>
      <div className='mt-8 mb-4'>
        <SkeletonLoader
          width='10rem'
          height='1.8rem'
        />
      </div>
      <div>
        <SkeletonLoader
          width='10rem'
          height='1.5rem'
        />
      </div>
      <div className='mt-8 flex flex-wrap gap-4'>
        <SkeletonLoader
          height='20rem'
          width='15rem'
        />
        <SkeletonLoader
          height='20rem'
          width='15rem'
        />
        <SkeletonLoader
          height='20rem'
          width='15rem'
        />
        <SkeletonLoader
          height='20rem'
          width='15rem'
        />
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className='bg-gray-100 animate-pulse h-48 flex items-center justify-center relative rounded-lg mb-10'>
      <div className='absolute top-40 bottom-0 right-6  rounded-full w-24 h-24'>
        {/* Avatar Skeleton */}
        <SkeletonLoader
          width='6rem'
          height='6rem'
          borderRadius='9999px'
        />
      </div>
    </div>
  );
}
export default function DashboardSkeleton() {
  return (
    <div className='relative'>
      {/* Banner Section */}
      <BannerSkeleton />

      {/* Content Below Banner */}
      <div className='p-4'>
        <h2>
          {/* User Name Skeleton */}
          <SkeletonLoader
            width='15rem'
            height='1.5rem'
          />{' '}
          <div className='sm:block md:inline md:ml-10'>
            {/* Email Skeleton */}
            <SkeletonLoader
              width='10rem'
              height='1rem'
            />{' '}
          </div>
        </h2>

        <div className='mt-4 flex md:flex-row justify-between items-center'>
          <div>
            <p>
              <SkeletonLoader
                width='5rem'
                height='1.25rem'
              />
            </p>
          </div>
          <div className='flex flex-row gap-5'>
            <p>
              <SkeletonLoader
                width='4rem'
                height='1.25rem'
              />
            </p>
            <p>
              <SkeletonLoader
                width='4rem'
                height='1.25rem'
              />
            </p>
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-10 mt-10'>
          {/* RecentActivity Skeleton */}
          <SkeletonLoader
            width='100%'
            height='200px'
            borderRadius='8px'
          />{' '}
          {/* ExpensesThisMonth Skeleton */}
          <SkeletonLoader
            width='100%'
            height='200px'
            borderRadius='8px'
          />{' '}
        </div>
        <div className='mt-10'>
          {/* ExpensesGraph Skeleton */}
          <SkeletonLoader
            width='100%'
            height='300px'
            borderRadius='8px'
          />{' '}
        </div>
      </div>
    </div>
  );
}
