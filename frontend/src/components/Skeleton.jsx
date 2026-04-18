import { motion } from "framer-motion";

const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

function SkeletonBox({ className = "" }) {
  return (
    <motion.div
      className={`rounded-xl ${className}`}
      style={{
        background: "linear-gradient(90deg, #dce8f0 25%, #b8d0e3 50%, #dce8f0 75%)",
        backgroundSize: "200% 100%",
      }}
      variants={shimmer}
      animate="animate"
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-navy-50">
      {/* Navbar */}
      <div className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-9 h-9" />
          <SkeletonBox className="w-32 h-5" />
        </div>
        <div className="flex items-center gap-4">
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-20 h-4" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Banner */}
        <SkeletonBox className="w-full h-28 mb-8" />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SkeletonBox className="h-32" />
          <SkeletonBox className="h-32" />
          <SkeletonBox className="h-32" />
        </div>

        {/* Profile */}
        <SkeletonBox className="w-full h-24 mb-8" />

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SkeletonBox className="h-32" />
          <SkeletonBox className="h-32" />
          <SkeletonBox className="h-32" />
          <SkeletonBox className="h-32" />
        </div>
      </div>
    </div>
  );
}

export function JobsSkeleton() {
  return (
    <div className="min-h-screen bg-navy-50">
      <div className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-9 h-9" />
          <SkeletonBox className="w-32 h-5" />
        </div>
        <div className="flex items-center gap-4">
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-20 h-4" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-8">
        <SkeletonBox className="w-48 h-8 mb-2" />
        <SkeletonBox className="w-72 h-4 mb-6" />
        <div className="flex gap-2 mb-6">
          {[1,2,3,4,5].map((i) => (
            <SkeletonBox key={i} className="w-20 h-8" />
          ))}
        </div>
        <div className="space-y-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-navy-100 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <SkeletonBox className="w-48 h-5" />
                  <SkeletonBox className="w-36 h-4" />
                  <SkeletonBox className="w-full h-4" />
                  <div className="flex gap-2">
                    <SkeletonBox className="w-16 h-6" />
                    <SkeletonBox className="w-16 h-6" />
                    <SkeletonBox className="w-16 h-6" />
                  </div>
                </div>
                <SkeletonBox className="w-20 h-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScoreSkeleton() {
  return (
    <div className="min-h-screen bg-navy-50">
      <div className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-9 h-9" />
          <SkeletonBox className="w-32 h-5" />
        </div>
        <div className="flex items-center gap-4">
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-20 h-4" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-8 py-8">
        <SkeletonBox className="w-48 h-8 mb-2" />
        <SkeletonBox className="w-72 h-4 mb-6" />
        <SkeletonBox className="w-full h-56 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SkeletonBox className="h-48" />
          <SkeletonBox className="h-48" />
          <SkeletonBox className="h-48" />
        </div>
        <SkeletonBox className="w-full h-32 mb-8" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBox className="h-12" />
          <SkeletonBox className="h-12" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-navy-50">
      <div className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-9 h-9" />
          <SkeletonBox className="w-32 h-5" />
        </div>
        <div className="flex items-center gap-4">
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-20 h-4" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-8 py-8">
        <SkeletonBox className="w-36 h-8 mb-2" />
        <SkeletonBox className="w-64 h-4 mb-8" />
        <div className="bg-navy-100 rounded-2xl p-6 mb-6">
          <SkeletonBox className="w-40 h-5 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBox className="h-10" />
            <SkeletonBox className="h-10" />
            <SkeletonBox className="h-10" />
            <SkeletonBox className="h-10" />
          </div>
        </div>
        <div className="bg-navy-100 rounded-2xl p-6 mb-6">
          <SkeletonBox className="w-24 h-5 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[1,2,3,4,5,6,7,8,9,10].map((i) => (
              <SkeletonBox key={i} className="w-20 h-8" />
            ))}
          </div>
        </div>
        <SkeletonBox className="w-full h-12" />
      </div>
    </div>
  );
}