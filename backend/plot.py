import numpy as np
import matplotlib.pyplot as plt
from sympy.parsing.latex import parse_latex
import sympy as sp
import re
from io import BytesIO


def generate_gradinet_descent_plot(equation, learning_rate, x0, y0):
    try:
        x_sym, y_sym = sp.symbols('x y')
        equation = re.sub(r'\\ ', '', equation)
        equation = re.sub(r'\\', '', equation)
        eq = parse_latex(equation)
        f = sp.lambdify((x_sym, y_sym), eq, 'numpy')

        print(eq)
        grad = sp.Matrix([sp.diff(eq, x_sym), sp.diff(eq, y_sym)])
        grad_f = sp.lambdify((x_sym, y_sym), grad, 'numpy')

        x = np.linspace(-3 -x0, 3 + x0, 100)
        y = np.linspace(-3 -y0, 3 + y0, 100)
        X,Y = np.meshgrid(x, y)
        Z = f(X, Y)

        curr_x = x0
        curr_y = y0
        lr = learning_rate
        steps = []
        for _ in range(20):
            steps.append([curr_x, curr_y])
            g = grad_f(curr_x, curr_y)
            curr_x -= lr * float(g[0])
            curr_y -= lr * float(g[1])

        steps = np.array(steps)

        plt.plot(figsize=(10,10))
        cp = plt.contour(X, Y, Z, levels=20,cmap = 'viridis')
        plt.colorbar(cp)
        plt.plot(steps[:,0], steps[:,1], 'ro-',markersize=3)
        plt.title('Contour plot')
        plt.xlabel('x')
        plt.ylabel('y')

        buf = BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        return buf
    except Exception as e:
        print(f"Error in gradient descent plot: {str(e)}")
        raise
    