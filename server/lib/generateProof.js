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
        const calldata = calldataBlob.split(',');

        const proofString = calldata[0].replace(/"/g, '').replace(/\[|\]/g, '');
        const publicSignalsString = JSON.parse(calldata[1]);

        console.log('Proof:', proofString)
        console.log('PublicSignals:', publicSignalsString)

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