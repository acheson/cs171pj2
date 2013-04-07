import ch1, imdb, json
import inspect, pprint, time, pickle

## prints out the mov_obj for debugging purposes using prettyprint.
def pp():
    pprint.pprint((mov_obj))

# open mov_obj in its current state
f = open('mov_obj.pickle', 'r')

### The intouchables is not on 1channel
### Bicycle thieves not on 1channel
### For a few dollars more not on 1channel


# begin and end variables--use to control particular movies being scrapted
begin = 247
end = 250

# make empty string if no proxy desired
proxy = "127.0.0.1:9050"

# this will be the final json obj
mov_obj = pickle.load(f)
# mov_obj = {}

def rw_pickle(f):
    f.close()
    f = open('mov_obj.pickle', 'w')
    pickle.dump(mov_obj, f)
    f.close()

# get the top 250 movies from the imdb list, add them to the movies object, uncomment line to build obj
# imdb.get_top250(mov_obj)



# get 1channel details
# counter = begin
# # for mov in mov_obj[(begin-1):end]:
#     print "Attempting movie", str(counter) + ":", str(mov['title'].encode('ascii','ignore')) + "........"
    
#     ch1.get_1ch_details(mov['title'], mov, proxy)
#     counter += 1
#     time.sleep(10)
#     rw_pickle(f)

# f.close()