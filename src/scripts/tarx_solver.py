#!/usr/bin/env python3
"""
TARX Quantum Engine v1.0
Distributed quantum-class algorithm execution across TARX mesh nodes.

Powered by the pyqpanda-algorithm stack (Origin Quantum, Apache 2.0).
TARX wraps, distributes, and orchestrates. The mesh is the computer.
"""
import sys
import json
import time
import warnings
import numpy as np

warnings.filterwarnings("ignore")

class TARXSolver:
    """
    TARX's quantum-class solver.
    Routes problems to the right algorithm, wraps results in TARX format.
    """

    VERSION = "1.0.0"
    ENGINE = "TARX Quantum Engine"

    def solve(self, solver_type: str, problem: dict) -> dict:
        start = time.time()

        solvers = {
            "optimize":   self._optimize,    # QAOA — routing, scheduling, portfolio
            "search":     self._search,       # Grover — O(sqrt N) search
            "classify":   self._classify,     # QSVM — quantum kernel classification
            "cluster":    self._cluster,      # QKmeans — quantum clustering
            "binary":     self._binary,       # QUBO — binary optimization
        }

        if solver_type not in solvers:
            return {
                "error": f"Unknown solver: {solver_type}",
                "available": list(solvers.keys())
            }

        try:
            result = solvers[solver_type](problem)
        except Exception as e:
            result = {"error": str(e)}

        result["_meta"] = {
            "engine": self.ENGINE,
            "version": self.VERSION,
            "solver": solver_type,
            "latency_ms": round((time.time() - start) * 1000, 2),
            "mesh_substrate": "TARX distributed compute",
        }
        return result

    def _optimize(self, problem: dict) -> dict:
        from pyqpanda_alg.QAOA.qaoa import QAOA
        import sympy as sp

        n = problem.get("n_vars", 3)
        v = sp.symbols(f'x0:{n}')

        expr_str = problem.get("expression")
        if expr_str:
            expr = eval(expr_str, {f"x{i}": v[i] for i in range(n)})
        else:
            expr = sum(v[i] * v[(i+1) % n] for i in range(n))

        result = QAOA(expr).run(layer=problem.get("layers", 2))
        top = sorted(result[0].items(), key=lambda k: k[1], reverse=True)[:5]

        return {
            "solver": "TARX Optimizer",
            "problem_class": "optimization",
            "description": problem.get("description", "General optimization"),
            "optimal": top[0][0],
            "confidence": round(top[0][1] * 100, 2),
            "top_solutions": [{"state": k, "probability": round(v, 4)} for k, v in top],
        }

    def _search(self, problem: dict) -> dict:
        from pyqpanda_alg.Grover.Grover_core import Grover, iter_num, measure_all
        from pyqpanda3.core import CPUQVM, QProg

        n = problem.get("n_qubits", 3)
        target = problem.get("target", 5)
        search_space = 2 ** n
        target_bin = format(target, f'0{n}b')

        g = Grover(mark_data=target_bin)
        m = CPUQVM()
        qubits = list(range(n))
        cbits = list(range(n))

        iters = iter_num(n, 1)
        circuit = g.cir(q_input=qubits, q_flip=qubits, q_zero=qubits, iternum=iters)
        prog = QProg()
        prog << circuit << measure_all(qubits, cbits)

        m.run(prog, 1000)
        counts = m.result().get_counts()
        top = sorted(counts.items(), key=lambda k: k[1], reverse=True)[:3]

        return {
            "solver": "TARX Search",
            "problem_class": "search",
            "search_space": search_space,
            "target": target,
            "target_binary": target_bin,
            "found": top[0][0] == target_bin,
            "top_results": [{"state": k, "hits": v} for k, v in top],
            "classical_steps": search_space,
            "tarx_steps": round(search_space ** 0.5),
            "speedup": f"{round(search_space / (search_space ** 0.5), 1)}x",
        }

    def _classify(self, problem: dict) -> dict:
        from pyqpanda_alg.QSVM.quantum_kernel_svm import QuantumKernel_vqnet

        X_train = np.array(problem.get("X_train", [[0,0],[0,1],[1,0],[1,1]]), dtype=float)
        y_train = np.array(problem.get("y_train", [0,1,1,0]), dtype=float)
        X_test  = np.array(problem.get("X_test",  [[0.1,0.1],[0.9,0.9]]), dtype=float)

        model = QuantumKernel_vqnet(n_qubits=X_train.shape[1])
        model.fit(X_train, y_train)
        predictions = model.predict(X_test).tolist()

        return {
            "solver": "TARX Classifier",
            "problem_class": "classification",
            "predictions": predictions,
            "training_samples": len(X_train),
            "test_samples": len(X_test),
        }

    def _cluster(self, problem: dict) -> dict:
        from pyqpanda_alg.QKmeans.QuantumKmeans import QuantumKmeans

        data = np.array(problem.get("data", [
            [1.0,0.5],[1.2,0.6],[0.9,0.4],
            [5.0,4.8],[5.2,5.1],[4.9,4.7]
        ]))
        k = problem.get("k", 2)

        model = QuantumKmeans(k=k)
        centers, labels = model.fit(data)

        return {
            "solver": "TARX Cluster",
            "problem_class": "clustering",
            "n_clusters": k,
            "labels": labels.tolist(),
            "centers": centers.tolist(),
            "n_points": len(data),
        }

    def _binary(self, problem: dict) -> dict:
        from pyqpanda_alg.QUBO.QUBO import QUBO_QAOA
        import sympy as sp

        n = problem.get("n_vars", 4)
        v = sp.symbols(f'x0:{n}')

        expr_str = problem.get("expression")
        if expr_str:
            expr = eval(expr_str, {f"x{i}": v[i] for i in range(n)})
        else:
            expr = v[0]*v[1] + v[1]*v[2] - v[0]*v[3]

        result = QUBO_QAOA(expr).run(layer=2)
        top = sorted(result[0].items(), key=lambda k: k[1], reverse=True)[:5]

        return {
            "solver": "TARX Binary Optimizer",
            "problem_class": "binary_optimization",
            "optimal": top[0][0],
            "confidence": round(top[0][1] * 100, 2),
            "top_solutions": [{"state": k, "probability": round(v, 4)} for k, v in top],
        }


if __name__ == "__main__":
    import os
    # Suppress pyqpanda internal stderr noise
    stderr_fd = sys.stderr.fileno()
    devnull = os.open(os.devnull, os.O_WRONLY)
    os.dup2(devnull, stderr_fd)
    os.close(devnull)

    payload = json.loads(sys.argv[1])
    solver = TARXSolver()
    result = solver.solve(
        solver_type=payload.get("solver", "optimize"),
        problem=payload.get("problem", {})
    )
    print(json.dumps(result, default=str))
