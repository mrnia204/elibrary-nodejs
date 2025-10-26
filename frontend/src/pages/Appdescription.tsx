import { features } from "@/data/features";

const Appdescription = () => {
  return ( 
    <div className="bg-white">
      <div className="wrapper py-22">
        <div className="text-center mb-16">
          <h2 className="h2-bold">Platform Features</h2>
          <p className="p-standard">Everything you need for digital learning management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`${feature.class} rounded-xl hover:rounded-2xl text-center shadow hover:shadow-lg p-8`}>
              <div className={`${feature.bgcolor} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6`}>
                <i className={`${feature.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default Appdescription;