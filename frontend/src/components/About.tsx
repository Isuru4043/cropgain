import Image from "next/image";

export default function About() {
  return (
    <section
      className="bg-white text-green-900 py-8 px-10"
      style={{ minHeight: "100vh" }}
    >
      <div className="container mx-auto text-center mb-10">
        <h2 className="text-5xl font-bold mb-10">How We Can Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-110">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/assets/record.webp"
                alt="Record-Keeping"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3 className="text-xl font-semibold">Record-Keeping</h3>
            <p className="mt-4">
              Fulfill reporting requirements and record your farm&apos;s
              activities as they happen. With Croptracker, your spray, employee,
              harvest, irrigation, and other production practice records are
              only a few clicks or taps away - whenever and wherever you need
              them.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/assets/shedule.webp"
                alt="Scheduling"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3 className="text-xl font-semibold">Scheduling</h3>
            <p className="mt-4">
              Keep your farm on track and avoid forgotten or duplicated tasks.
              Create your own schedules quickly and easily or choose from
              thousands of schedule templates.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/assets/crew.webp"
                alt="Work Crew Communications & Activity Tracking"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3 className="text-xl font-semibold">
              Work Crew Communications & Activity Tracking
            </h3>
            <p className="mt-4">
              A connected team is a more productive team. Monitor, assign tasks
              to, and communicate with your employees in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/assets/analyse.webp"
                alt="Analytics & Reports"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3 className="text-xl font-semibold">Analytics & Reports</h3>
            <p className="mt-4">
              Capable of generating more than 50 reports, Croptracker makes
              tracking your farm&apos;s progress a snap and can shave days off
              the auditing process. Let us handle the paperwork so you can get
              back to your farm.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/assets/location.webp"
                alt="Traceability"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3 className="text-xl font-semibold">Traceability</h3>
            <p className="mt-4">
              We&apos;re here to make food safety simple. View where any given
              product came from, right down to the block and employee
              responsible. Create detailed traceability reports to meet food
              safety requirements and improve risk management when incidents and
              food recalls occur.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/assets/support.webp"
                alt="Comprehensive Support"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3 className="text-xl font-semibold">Comprehensive Support</h3>
            <p className="mt-4">
              Our Support Team is ready to assist you at every step of the way -
              from set-up, to troubleshooting, to customizing your package to
              fit your unique needs. We&apos;ll help you get the most out of
              your software, so it can help you get the most out of your farm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
