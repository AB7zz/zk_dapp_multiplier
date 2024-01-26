import path from "path";
import * as snarkjs from 'snarkjs'

export const generateProof = async (input0, input1) => {
    console.log(`Generating vote proof with inputs: ${input0}, ${input1}`);
  
    const inputs = {
        in: [input0, input1],
    }

    const wasmPath = path.join(process.cwd(), '../circuits/build/multiplier_js/multiplier.wasm');
    const provingKeyPath = path.join(process.cwd(), '../circuits/build/circuit.zkey')

    try{
        const { proof, publicSignals } = await snarkjs.plonk.fullProve(inputs, wasmPath, provingKeyPath);
        const calldataBlob = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);
        let proofString
        let publicSignalsString

        const regex = /\[([^[]+)]\[([^[]+)]/;
        const match = calldataBlob.match(regex);

        if (match) {
            proofString = match[1];
            publicSignalsString = match[2];

            proofString = JSON.parse(`[${proofString}]`);
            publicSignalsString = JSON.parse(`[${publicSignalsString}]`);

            console.log('Proof:', proof);
            console.log('Public Signals:', publicSignals);
        }

        return {
            proof: proofString, 
            publicSignals: publicSignalsString,
        }
    }catch(err){
        console.log(`Error:`, err)
        return {
            proof: "", 
            publicSignals: [],
        }
    }
}