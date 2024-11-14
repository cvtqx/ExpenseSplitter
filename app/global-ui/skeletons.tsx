// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const SkeletonLoader = ({
  width = '100%',
  height = '100px',
  borderRadius = '8px',
}) => {
  return (
    <div
      className={`relative overflow-hidden ${shimmer}`}
      style={{ width, height, borderRadius }}>
      {/* Shimmer effect */}
      <div className={`absolute inset-0 ${shimmer}`} />

      {/* Placeholder skeleton */}
      <div className='w-full h-full bg-gray-300 rounded-lg'></div>
    </div>
  );
};

export default function DashboardSkeleton() {
  return (
    <div className={`relative ${shimmer}`}>
      {/* Banner Section */}
      <div className='bg-gray-300 h-48 flex items-center justify-center relative rounded-lg mb-10'>
        <SkeletonLoader
          width='6rem'
          height='6rem'
          borderRadius='9999px'
        />{' '}
        {/* Avatar Skeleton */}
      </div>

      {/* Content Below Banner */}
      <div className='p-4'>
        <h2>
          <SkeletonLoader
            width='15rem'
            height='1.5rem'
          />{' '}
          {/* User Name Skeleton */}
          <div className='sm:block md:inline md:ml-10'>
            <SkeletonLoader
              width='10rem'
              height='1rem'
            />{' '}
            {/* Email Skeleton */}
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
          <SkeletonLoader
            width='100%'
            height='200px'
            borderRadius='8px'
          />{' '}
          {/* RecentActivity Skeleton */}
          <SkeletonLoader
            width='100%'
            height='200px'
            borderRadius='8px'
          />{' '}
          {/* ExpensesThisMonth Skeleton */}
        </div>
        <div className='mt-10'>
          <SkeletonLoader
            width='100%'
            height='300px'
            borderRadius='8px'
          />{' '}
          {/* ExpensesGraph Skeleton */}
        </div>
      </div>
    </div>
  );
}
