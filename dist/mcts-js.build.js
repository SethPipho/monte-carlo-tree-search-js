(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Axon = {}));
}(this, function (exports) { 'use strict';

    class MCTSNode {
        constructor(moves, parent){
            this.parent = parent;
            this.visits = 0; 
            this.wins = 0; 
            this.numUnexpandedMoves = moves.length;
            this.children = new Array(this.numUnexpandedMoves).fill(null); //temporary store move for debugging purposes
        }   
    }


    class MCTS {
        constructor(game, player){
            this.game = game;
            this.player = player;
        }

        selectMove(){
            const originalState = this.game.getState();
            const possibleMoves = this.game.moves();
            const root = new MCTSNode(possibleMoves, null);

            for (let i = 0; i < 1000; i++){
                this.game.setState(originalState);
                const clonedState = this.game.cloneState();
                this.game.setState(clonedState);
                
                let selectedNode = this.selectNode(root);
                if (this.game.gameOver()){
                    if (this.game.winner() != this.player && this.game.winner() != -1){
                        selectedNode.parent.wins = Number.MIN_SAFE_INTEGER;
                        //selectedNode.parent.visits = 0
                    }
                }
                let expandedNode = this.expandNode(selectedNode);
                let winner = this.rollout(expandedNode);
                this.backprop(expandedNode, winner);
            }

            let maxWins = -Infinity;
            let maxIndex = -1;
            for (let i in root.children){
                const child = root.children[i];
                if (child.wins > maxWins){
                    maxWins = child.wins;
                    maxIndex = i;
                }
            }

            /* for (let i in root.children){
                const child = root.children[i]
                console.log(child.play, child.node.wins, child.node.visits)
            }
     */
            this.game.setState(originalState);
            return possibleMoves[maxIndex]
        }
        selectNode(root){

            const c = 1.41;

            while (root.numUnexpandedMoves == 0){
                let maxUBC = -Infinity;
                let maxIndex = -1;
                let Ni = root.visits;
                for (let i in root.children){
                    const child = root.children[i];
                    const ni = child.visits;
                    const wi = child.wins;
                    const ubc = this.computeUCB(wi,ni,c,Ni);
                    if (ubc > maxUBC){
                        maxUBC = ubc;
                        maxIndex = i;
                    }
                }
                const moves = this.game.moves();
                this.game.playMove(moves[maxIndex]);
               
                root = root.children[maxIndex];
                if (this.game.gameOver()){
                    return root
                }
            }
            return root
        }

        expandNode(node){
            if (this.game.gameOver()){
                return node
            }
            let moves = this.game.moves(); 
            const childIndex = this.selectRandomUnexpandedChild(node);
            this.game.playMove(moves[childIndex]);

            moves = this.game.moves();
            const newNode = new MCTSNode(moves, node);
            node.children[childIndex] = newNode;
            node.numUnexpandedMoves -= 1;
           
            return newNode
        }

        rollout(node){
            while (!this.game.gameOver()){
                const moves = this.game.moves();
                const randomChoice = Math.floor(Math.random() * moves.length);
                this.game.playMove(moves[randomChoice]);
            }
            return this.game.winner()
        }
        backprop(node, winner){  
            while (node != null){
                node.visits += 1;
                if (winner == -1){
                    node.wins += 0; //draw
                }else if (winner == this.player){
                    node.wins += 1;
                } else {
                    node.wins -= 1;
                } 
                node = node.parent;
            }
        }

        // returns index of a random unexpanded child of node
        selectRandomUnexpandedChild(node){
            const choice = Math.floor(Math.random() * node.numUnexpandedMoves); //expand random nth unexpanded node
            let count = -1;
            for (let i in node.children){
                const child = node.children[i];
                if (child == null){
                    count += 1;
                }
                if (count == choice){
                    return i
                }
            }
        }

        computeUCB(wi, ni, c, Ni){
            return (wi/ni) + c * Math.sqrt(Math.log(Ni)/ni)
        }
    }

    exports.MCTS = MCTS;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
