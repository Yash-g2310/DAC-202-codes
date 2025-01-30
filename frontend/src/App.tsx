import React, { useState } from 'react'
import 'mathquill/build/mathquill.css'
import { addStyles, EditableMathField } from 'react-mathquill'
import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.baseURL = 'https://dac-202-codes.onrender.com';

addStyles()

interface FormData {
  equation: string;
  x0: number;
  y0: number;
  learningRate: number;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    equation: "\\left(x^2+2xy+2y^2+x\\right)",
    x0: 0.5,
    y0: 0.5,
    learningRate: 0.1
  })
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    try {
      const response = await axios.post('/gradient_descent', formData, {
        responseType: 'blob'
      });
      const imgUrl = URL.createObjectURL(new Blob([response.data]));
      setImageUrl(imgUrl);
      setErrorMessage(null)
      setShowModal(true);
      console.log("Response: ", response.data);
    } catch (error) {
      console.error("Error: ", error);
      setErrorMessage("An error occurred while generating the gradient descent plot. Please try again.");
      setImageUrl(null)
      setShowModal(true);

    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center gap-5">
      <div className=" relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <form onSubmit={handleSubmit}>
          <div className="divide-y divide-gray-200 flex flex-col gap-5">

            <div className='border-2  border-gray-200 rounded-2xl p-4 text-xl'>
              <label className="text-4xl text-center text-gray-700 ">
                Enter the equation in 2 variables
              </label>

              <div className="py-8">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <EditableMathField
                    latex={formData.equation}
                    onChange={(mathField) => {
                      setFormData({
                        ...formData,
                        equation: mathField.latex()
                      })
                    }}
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className=' flex flex-row gap-4 items-center justify-center h-fit-content'>
              <div className='border-2 border-gray-200 rounded-2xl p-4'>
                <div className='text-2xl '>
                  <h2 className=" text-center text-gray-700 font-semibold ">
                    Enter the initial value of x and y
                  </h2>
                </div>

                <div className="py-8 flex flex-col gap-4 items-center justify-center">
                  <div className="flex flex-row gap-4 items-center justify-center">
                    <label className="text-xl text-gray-700 font-medium">
                      x:
                    </label>
                    <input
                      type="number"
                      value={formData.x0}
                      onChange={(e) => setFormData({
                        ...formData,
                        x0: parseFloat(e.target.value)
                      })}
                      className=" max-w-24 text-center focus:outline-none bg-gray-50 rounded-lg border border-gray-200"
                    />

                  </div>
                  <div className="flex flex-row gap-4 items-center justify-center">
                    <label className="text-xl text-gray-700 font-medium">
                      y:
                    </label>
                    <input
                      type="number"
                      value={formData.y0}
                      onChange={(e) => setFormData({
                        ...formData,
                        y0: parseFloat(e.target.value)
                      })}
                      className=" max-w-24 text-center focus:outline-none bg-gray-50 rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className='border-2 border-gray-200 rounded-2xl p-4'>
                <div className='text-2xl'>
                  <h2 className=" text-center text-gray-700 font-semibold">
                    Enter the learning rate
                  </h2>
                </div>

                <div className="flex flex-row gap-4 items-center justify-center">
                  <label className="text-xl text-gray-700 font-medium">
                    &eta; :
                  </label>
                  <input
                    type="number"
                    value={formData.learningRate}
                    onChange={(e) => setFormData({
                      ...formData,
                      learningRate: parseFloat(e.target.value)
                    })}
                    className=" max-w-24 text-center focus:outline-none bg-gray-50 rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            </div>
            <button type='submit' className='mt-8 px-8 py-4 bg-blue-600 text-xl font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mx-auto w-1/3 block'>Show Gradient Descent</button>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Gradient Descent Plot</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              imageUrl && (
                <img
                  src={imageUrl}
                  alt="Gradient Descent Plot"
                  className="w-full h-auto"
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
